// src/graphql/rickmorty/resolvers.ts

import axios from 'axios';


// Helper function to determine if a Rick and Morty should be associated
const shouldAssociate = (rick: any, morty: any) => {
    if (rick.origin?.id && morty.origin?.id && rick.origin.id === morty.origin.id) {
        return true;
    }
    if (rick.origin?.name === 'unknown' && morty.origin?.name === 'unknown') {
        const rickNamePattern = rick.name.replace('Rick', '').trim();
        const mortyNamePattern = morty.name.replace('Morty', '').trim();
        return rickNamePattern === mortyNamePattern;
    }
    if (rick.location?.id && morty.location?.id && rick.location.id === morty.location.id && rick.location.id !== '3') {
        return true;
    }
    return false;
};

type PocketMortyData = {
    assetid: string;
    alias: string | null;
    dimensions: string | null;
    name: string;
};

type PocketNPCData = {
    alias: string | null;
    npc_name: string;
};

// Interface for Morty objects from the Rick and Morty API
interface Morty {
    id: string;
    name: string;
    // ... other fields that Morty objects contain
}

type UnifiedMorty = Morty & PocketMortyData;

const rickMortyResolvers = {
    Query: {
        charactersByName: async (_: any, args: { name: string }) => {
            const query = `
                {
                    characters(filter: {name: "${args.name}"}) {
                        results {
                            id
                            name
                            status
                            species
                            type
                            gender
                            image
                            origin {
                                id
                                name
                            }
                            location {
                                id
                                name
                            }
                        }
                    }
                }`;
            try {
                const response = await axios.post('https://rickandmortyapi.com/graphql', {query});
                return response.data.data.characters.results;
            } catch (error) {
                console.error("Error fetching characters:", error);
                return [];
            }
        },

        rickAndMortyAssociations: async () => {
            try {
                const ricksResponse = await axios.get('https://rickandmortyapi.com/api/character/?name=Rick');
                const mortiesResponse = await axios.get('https://rickandmortyapi.com/api/character/?name=Morty');
                const ricks = ricksResponse.data.results;
                const morties = mortiesResponse.data.results;

                const pocketMortysResponse = await axios.get('https://pocketmortys.net/components/com_pocketmortys/json/datatables/MortysTable_en.json');
                const pocketNPCsResponse = await axios.get('https://pocketmortys.net/components/com_pocketmortys/json/datatables/NPCsTable_en.json');
                const pocketMortys = pocketMortysResponse.data.data;
                const pocketNPCs = pocketNPCsResponse.data.data;

                const pocketAssociations = pocketNPCs.map((npc: any) => {
                    const rickAlias = npc.alias.replace(/-/g, ' ');
                    const associatedMorties = pocketMortys.filter((morty: any) => {
                        const mortyAlias = morty.alias.replace(/^\d+-/, '').replace(/-/g, ' ');
                        return mortyAlias.includes(rickAlias);
                    });
                    return {rick: npc, morties: associatedMorties};
                });

                const combinedAssociations = [...ricks.map((rick: any) => {
                    const associatedMorty = morties.find((morty: any) => shouldAssociate(rick, morty));
                    return {rick, morties: associatedMorty ? [associatedMorty] : []};
                }), ...pocketAssociations];

                // Adding orphaned Morties (those without an associated Rick)
                const orphanedMorties = morties.filter((morty: Morty) => {
                    return !combinedAssociations.some(association =>
                        association.morties.some((m: UnifiedMorty) => m.id === morty.id)
                    );
                }).map(morty => ({ id: morty.id, name: morty.name }));

// Adding orphaned Morties from PocketMortys
                const orphanedPocketMorties = pocketMortys.filter((pocketMorty: PocketMortyData) => {
                    return !combinedAssociations.some(association =>
                        association.morties.some((m: UnifiedMorty) => m.assetid === pocketMorty.assetid)
                    );
                }).map(pocketMorty => ({ id: pocketMorty.assetid, name: pocketMorty.name }));



                return {
                    associations: combinedAssociations,
                    orphanedMorties: [...orphanedMorties, ...orphanedPocketMorties]
                };



            } catch (error) {
                console.error("Error in rickAndMortyAssociations:", error);
                return {associations: [], orphanedMorties: []};
            }
        },

        // ... other resolvers, such as pocketMortys, pocketMorty, pocketNpcs, pocketNpc
    }
};

export default rickMortyResolvers;

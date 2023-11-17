// src/graphql/rickmorty/resolvers.ts

import axios from 'axios';

// Helper function to determine if a Rick and Morty should be associated
const shouldAssociate = (rick: any, morty: any) => {
    console.log(`|-SA-| 0) Checking association for Rick: ${JSON.stringify(rick)} :: Morty: ${JSON.stringify(morty)}`);

    // Match by origin id
    if (rick.origin?.id && morty.origin?.id && rick.origin.id === morty.origin.id) {
        console.log(`|-SA-| 1) Comparing origin IDs: Rick: ${rick.origin.id} :: Morty: ${morty.origin.id}`);
        return true;
    }

    // If origin is unknown, match by name pattern
    if (rick.origin?.name === 'unknown' && morty.origin?.name === 'unknown') {
        const rickNamePattern = rick.name.replace('Rick', '').trim();
        const mortyNamePattern = morty.name.replace('Morty', '').trim();

        if (rickNamePattern && mortyNamePattern && rickNamePattern === mortyNamePattern) {
            console.log(`|-SA-| 2) Comparing name patterns: Rick: ${rickNamePattern} :: Morty: ${mortyNamePattern}`);
            return true;
        }
    }

    // Match by location if both locations are known and not the Citadel of Ricks
    if (rick.location?.id && morty.location?.id && rick.location.id === morty.location.id && rick.location.id !== '3') {
        console.log(`|-SA-| 3) Comparing location IDs: Rick: ${rick.location.id} - ${rick.location.name} :: Morty: ${morty.location.id} - ${morty.location.name}`);
        return true;
    }

    console.log(`|-SA-| 4) No match found for Rick: ${rick.name} :: Morty: ${morty.name}`);
    return false;
};


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

                return ricks.map((rick: any) => {
                    const associatedMorty = morties.find((morty: any) => shouldAssociate(rick, morty));
                    return {
                        rick,
                        morties: associatedMorty ? [associatedMorty] : []
                    };
                });
            } catch (error) {
                console.error("Error in rickAndMortyAssociations:", error);
                return [];
            }
        },
    }
};

export default rickMortyResolvers;

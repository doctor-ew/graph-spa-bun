// src/graphql/rickmorty/resolvers.ts

import axios from 'axios';

// Helper function to determine if a Rick and Morty should be associated
const shouldAssociate = (rick: any, morty: any) => {
    //console.log(`|-SA-| 0) Checking association for Rick: ${JSON.stringify(rick)} :: Morty: ${JSON.stringify(morty)}`);

    // Match by origin id
    if (rick.origin?.id && morty.origin?.id && rick.origin.id === morty.origin.id) {
        // console.log(`|-SA-| 1) Comparing origin IDs: Rick: ${rick.origin.id} :: Morty: ${morty.origin.id}`);
        return true;
    }

    // If origin is unknown, match by name pattern (e.g. Alien Rick and Alien Morty)
    if (rick.origin?.name === 'unknown' && morty.origin?.name === 'unknown') {
        const rickNamePattern = rick.name.replace('Rick', '').trim();
        const mortyNamePattern = morty.name.replace('Morty', '').trim();

        if (rickNamePattern && mortyNamePattern && rickNamePattern === mortyNamePattern) {
            // console.log(`|-SA-| 2) Comparing name patterns: Rick: ${rickNamePattern} :: Morty: ${mortyNamePattern}`);
            return true;
        }
    }

    // Match by location if both locations are known and not the Citadel of Ricks
    if (rick.location?.id && morty.location?.id && rick.location.id === morty.location.id && rick.location.id !== '3') {
        // console.log(`|-SA-| 3) Comparing location IDs: Rick: ${rick.location.id} - ${rick.location.name} :: Morty: ${morty.location.id} - ${morty.location.name}`);
        return true;
    }

    // console.log(`|-SA-| 4) No match found for Rick: ${rick.name} :: Morty: ${morty.name}`);
    return false;
};

const rickMortyResolvers = {
    Query: {
        // Resolves characters by name
        charactersByName: async (_: any, args: { name: string }) => {
            // GraphQL query to fetch characters by name
            const query = `
                {
                    characters(filter: {name: "${args.name}"}) {
                        results {
                            // Fields to retrieve for each character
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
                // Making a POST request to the Rick and Morty GraphQL API
                const response = await axios.post('https://rickandmortyapi.com/graphql', {query});
                // Returning the results from the response
                return response.data.data.characters.results;
            } catch (error) {
                // Handling errors in fetching characters
                console.error("Error fetching characters:", error);
                return [];
            }
        },

        // Resolves associations between Ricks and Morties
        rickAndMortyAssociations: async () => {
            try {
                // Fetching all characters named 'Rick'
                const ricksResponse = await axios.get('https://rickandmortyapi.com/api/character/?name=Rick');
                // Fetching all characters named 'Morty'
                const mortiesResponse = await axios.get('https://rickandmortyapi.com/api/character/?name=Morty');

                // Extracting results from responses
                const ricks = ricksResponse.data.results;
                const morties = mortiesResponse.data.results;

                // Mapping each Rick to an associated Morty
                return ricks.map((rick: any) => {
                    // Finding an associated Morty for each Rick
                    const associatedMorty = morties.find((morty: any) => shouldAssociate(rick, morty));
                    // Returning the Rick and any associated Morty
                    return {
                        rick,
                        morties: associatedMorty ? [associatedMorty] : []
                    };
                });
            } catch (error) {
                // Handling errors in rickAndMortyAssociations query
                console.error("Error in rickAndMortyAssociations:", error);
                return [];
            }
        },
    }
};

export default rickMortyResolvers;

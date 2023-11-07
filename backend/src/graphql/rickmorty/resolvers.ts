import axios from 'axios';

// Helper function to determine if a Rick and Morty should be associated
const shouldAssociate = (rick:any, morty:any) => {
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

        charactersByName: async (_: any, args: { name: string }, context: any) => {
            /*
            const cache = context.cache;
            if (context.cacheControl) {
                context.cacheControl.setCacheHint({maxAge: 360, scope: 'PRIVATE'});
            }

            const cacheKey = `charactersByName:${args.name}`;
            const cachedData = await cache.get(cacheKey);

            if (cachedData) {
                // Deserialize the data when retrieving it from the cache
                return JSON.parse(cachedData);
            }
*/
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

                let responseData = response.data.data.characters.results;
                // Serialize the data before storing it in the cache
               //await cache.set(cacheKey, JSON.stringify(responseData), {ttl: 5});

                return responseData;
            } catch (error) {
                console.error("Error fetching characters:", error);
                return [];
            }
        },
/*
        episodesByIds: async (_: any, args: { ids: number[] }) => {
            try {
                const response = await axios.get(`https://rickandmortyapi.com/api/episode/${args.ids.join(',')}`);
                return Array.isArray(response.data) ? response.data : [response.data];
            } catch (error) {
                console.error("Error fetching episodes:", error);
                return [];
            }
        },
*/
        rickAndMortyAssociations: async (_: any, _args: any, context: any) => {
            const ricks = await rickMortyResolvers.Query.charactersByName(_, {name: "Rick"}, context);
            const morties = await rickMortyResolvers.Query.charactersByName(_, {name: "Morty"}, context);

            return ricks.map((rick: any) => {
                // Find the correct Morty that matches the Rick
                const associatedMorty = morties.find((morty: any) => shouldAssociate(rick, morty));

                console.log('|-aM-| associatedMorty: ', associatedMorty);
                console.log('|-RaM-| rick: ',rick,' :: associatedMorty: ',associatedMorty);
                // Return the Rick with the associated Morty (if any)
                return {
                    rick,
                    morties: associatedMorty ? [associatedMorty] : [] // Wrap the single Morty in an array
                };
            });
        },


    }
};

export default rickMortyResolvers

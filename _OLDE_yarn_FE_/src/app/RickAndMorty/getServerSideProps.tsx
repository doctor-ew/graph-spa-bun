// This function runs on the server and fetches the data on each request
export async function getServerSideProps() {
//export async function getServerSideProps() {
    // Fetch data from your API
    const res = await fetch('http://localhost:4000/rickmorty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                {
                    rickAndMortyAssociations {
                        rick {
                            id
                            name
                            origin {
                                id
                                name
                            }
                            location {
                                id
                                name
                            }
                            image
                        }
                        morties {
                            id
                            name
                            origin {
                                id
                                name
                            }
                            location {
                                id
                                name
                            }
                            image
                        }
                    }
                }
            `,
        }),
    });

    const result = await res.json();

    // Handle any errors in the response
    if (!res.ok || result.errors) {
        console.error('Failed to fetch Rick and Morty data:', result.errors);
        return {
            props: {
                data: null, // You could pass an error message here as well
            },
        };
    }

    // Pass the data to the page via props
    return {
        props: {
            data: result.data,
        },
    };
}

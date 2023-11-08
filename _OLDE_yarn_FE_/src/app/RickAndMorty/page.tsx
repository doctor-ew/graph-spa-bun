import React from 'react';

// Define the types for the data you expect
interface Origin {
    id: string;
    name: string;
}

interface Character {
    id: string;
    name: string;
    origin: Origin;
    location: Origin;
    image: string;
}

interface RickAndMortyAssociations {
    rick: Character; // Not an array
    morties: Character[]; // An array of Morty objects
}

interface RickAndMortyProps {
    rickAndMortyAssociations: RickAndMortyAssociations[];
    errors?: string;
}

// This is the React component that represents the page content
export default async function RickAndMortyPage() {
    let props: RickAndMortyProps | undefined;

    try {
        const response = await fetch('http://localhost:4000/rickmorty', {
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

        const json = await response.json();
        console.log('|-o-| json: ',json);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        if (json.errors) {
            throw new Error('Failed to fetch GraphQL data.');
        }

        props = { rickAndMortyAssociations: json.data.rickAndMortyAssociations };
    } catch (error) {
        return {
            errors: error instanceof Error ? error.message : 'An error occurred',
        };
    }

    // Use a React effect for logging or other side effects

    // Render the component
    if (props?.errors) {
        return <div>Error: {props.errors}</div>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Rick and Morty Data</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {props?.rickAndMortyAssociations?.map((association) => (
                        <div key={association.rick.id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="bg-gray-200 rounded-lg overflow-hidden">
                                <div
                                    className="bg-cover bg-center h-48"
                                    style={{ backgroundImage: `url(${association.rick.image})` }}
                                />
                            </div>
                            <dl className="mt-4">
                                <dt className="font-semibold">Rick: {association.rick.name}</dt>
                                <dd>Origin: {association.rick.origin?.name}</dd>
                                <dd>Location: {association.rick.location?.name}</dd>
                                {association.morties.length > 0 && (
                                    <div>
                                        <dt className="font-semibold mt-2">Associated Morty: {association.morties[0].name}</dt>
                                        <dd>
                                            <p>Origin: {association.morties[0].origin?.name}</p>
                                            <p>Location: {association.morties[0].location?.name}</p>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}


// /pages/rick-and-morty.tsx

import React, {useEffect} from 'react';
import {NextPageContext} from 'next';
import '../styles/globals.css';


// Define the types for the data you expect
interface Rick {
    id: string;
    name: string;
    origin: { id: string, name: string };
    location: { id: string, name: string };
    image: string;
    // ... other fields
}

interface Morty {
    id: string;
    name: string;
    origin: { id: string, name: string };
    location: { id: string, name: string };
    image: string;
    // ... other fields
}

interface RickAndMortyAssociations {
    rick: Rick; // Not an array
    morties: Morty[]; // An array of Morty objects
}

interface RickAndMortyData {
    rickAndMortyAssociations: RickAndMortyAssociations[];
}

interface RickAndMortyProps {
    data?: RickAndMortyData;
    errors?: string;
}


// This is the React component that represents the page content
const RickAndMortyPage: React.FC<RickAndMortyProps> = ({ data, errors }) => {
    useEffect(() => {
        console.log('|-D-| data:', data);
        console.log('|-A-| data:', data?.rickAndMortyAssociations);
        // Assign to a window variable for inspection
        if (data) {
            (window as any).myDebugData = data;
        }
    }, [data]); // This will run when `data` changes

    if (errors) {
        return <div>Error: {errors}</div>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className=" mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Rick and Morty Data</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.rickAndMortyAssociations?.map((association) => (
                    <div key={association.rick.id} className="bg-white rounded-lg shadow-md p-4">
                        <div className="bg-gray-200 rounded-lg overflow-hidden">
                            {/* Using background image via CSS */}
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
};


// This function runs on the server and gets the data for the page
export async function getServerSideProps(context: NextPageContext): Promise<{ props: RickAndMortyProps }> {
    try {
        const res = await fetch('http://backend:4000/rickmorty', {
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
              morties {
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
          }
        `,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Response not ok:', res);
            console.error('Response details:', data); // Log the response body for more details
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        if (data.errors) {
            console.error('GraphQL Errors:', data.errors);
            throw new Error('Failed to fetch GraphQL data.');
        }

        return {
            props: {data: data.data},
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            props: {errors: error instanceof Error ? error.message : 'An error occurred'},
        };
    }
}

export default RickAndMortyPage;

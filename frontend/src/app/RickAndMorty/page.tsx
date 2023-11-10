'use client';
// /app/rick-and-morty.tsx

import React, {  useEffect } from 'react';
import '@/styles/globals.css';

// Your interface definitions
interface Rick {
    id: string;
    name: string;
    origin: { id: string; name: string };
    location: { id: string; name: string };
    image: string;
    // ... other fields
}

interface Morty {
    id: string;
    name: string;
    origin: { id: string; name: string };
    location: { id: string; name: string };
    image: string;
    // ... other fields
}

interface RickAndMortyAssociations {
    rick: Rick;
    morties: Morty[];
}

interface RickAndMortyData {
    rickAndMortyAssociations: RickAndMortyAssociations[];
}

interface RickAndMortyProps {
    data?: RickAndMortyData;
    error?: string;
}

// The new loader function for server-side data fetching
export async function loader() {
    console.log('|-o-| loading');
    try {
        const res = await fetch('http://backend:4000/rickmorty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Your GraphQL query
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
        console.log('|-o-| data:', data);
        if (!res.ok) {
            console.log('|-o-| error:', data);
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        if (data.errors) {
            console.log('|-o-| error:', data);
            throw new Error('Failed to fetch GraphQL data.');
        }
        console.log('|-o-| data:', data.data);
        return { data: data.data };
    } catch (error) {
        console.log('|-o-| error:', error);
        return {
            error: error instanceof Error ? error.message : 'An error occurred',
        };
    }
}

// The React component for your page
const RickAndMortyPage: React.FC<RickAndMortyProps> = ({ data, error }) => {
    useEffect(() => {
        console.log('|-D-| data:', data);
        console.log('|-A-| data:', data?.rickAndMortyAssociations);
        if (data) {
            (window as any).myDebugData = data;
        }
    }, [data]);

    if (error) {
        console.log('|-o-| error:', error);
        return <div>Error: {error}</div>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Rick and Morty Data</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.rickAndMortyAssociations?.map((association) => (
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
};

export default RickAndMortyPage;

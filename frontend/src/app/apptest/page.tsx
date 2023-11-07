// /app/apptest/page.tsx
import React from 'react';

// Define the types for the data you expect
export interface TestProps {
    message: string;
    dogImage: string;
}

// This is the server component that represents the page content
export default async function TestPage() {
    let message = 'This is a test message from the server component.';
    let dogImage = '';

    try {
        const dogsData = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await dogsData.json();
        dogImage = data?.message; // Assuming the API returns the image URL in the message field
        console.log('|-o-| data: ',data);
    } catch (error) {
        console.error('|-E-| Error fetching dog image:', error);
        message = 'Failed to fetch dog image.'; // Return an error message
    }

    // Render your component with the fetched data
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mx-auto p-4">
                <h1>App Test Page</h1>
                <p>{message}</p>
                {/* Add an image tag to render the dog image */}
                {dogImage && <img src={dogImage} alt="A Random Dog" />}
            </div>
        </main>
    );
}

// /src/app/TravelData/page.tsx

import React from 'react';

// Define the types for the data you expect
interface Booking {
    bookingId: string;
    noOfAdults: number;
    // ... other fields
}

interface TravelDataProps {
    bookings: Booking[];
    errors?: string;
}

// This is the async function that fetches your data
async function fetchTravelData() {
    try {
        const response = await fetch('http://backend:4000/traveldata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
          query GetBookings {
            bookings {
              bookingId
              noOfAdults
              // ... other fields
            }
          }
        `,
            }),
        });

        const json = await response.json();
        if (!response.ok) {
            console.log('|-E-| response: ',response);
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        if (json.errors) {
            console.log('|-E-| json.errors: ',json);
            throw new Error('GraphQL errors occurred');
        }

        return { bookings: json.data.bookings };
    } catch (error) {
        console.log('|-E-| error: ',error);
        return {
            errors: error instanceof Error ? error.message : 'An error occurred',
        };
    }
}

// This is the React component that represents the page content
const TravelDataPage = async () => {
    const { bookings, errors } = await fetchTravelData();

    if (errors) {
        console.log('|-E-| errors: ',errors);
        return <div>Error: {errors}</div>;
    }

    console.log('|-o-| bookings: ',bookings);

    return (
        <main>
            <h1>Travel Data</h1>
            <ul>
                {bookings.map((booking:any) => (
                    <li key={booking.bookingId}>Adults: {booking.noOfAdults}</li>
                    // ... render other fields
                ))}
            </ul>
        </main>
    );
};

export default TravelDataPage;

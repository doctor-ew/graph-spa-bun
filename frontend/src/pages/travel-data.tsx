
// pages/travel-data.tsx
import React from 'react';
import { NextPageContext } from 'next';

interface Booking {
    bookingId: string;
    noOfAdults: number;
    // ... other fields
}

interface TravelDataProps {
    bookings?: Booking[];
    error?: string;
}

const TravelDataPage: React.FC<TravelDataProps> = ({ bookings, error }) => {
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main>
            <h1>Travel Data</h1>
            <ul>
                {bookings?.map((booking) => (
                    <li key={booking.bookingId}>Adults: {booking.noOfAdults}</li>
                    // ... render other fields
                ))}
            </ul>
        </main>
    );
};

export async function getServerSideProps(context: NextPageContext): Promise<{ props: TravelDataProps }> {
    try {
        const response = await fetch('http://localhost:4000/traveldata', {
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
            }
          }
        `,
            }),
        });

        const { data, errors } = await response.json();

        if (errors) {
            console.log('|-E-| errors: ',errors);
            throw new Error('Failed to fetch GraphQL data.');
        }

        console.log('|-o-| data: ',data);
        return {
            props: { bookings: data.bookings }, // Pass the data to the page via props
        };
    } catch (error) {
        return {
            props: { error: error instanceof Error ? error.message : 'An error occurred' },
        };
    }
}

export default TravelDataPage;

// components/RickCard.tsx
import React from 'react';

interface Rick {
    id: string;
    name: string;
    origin: { id: string, name: string };
    location: { id: string, name: string };
    image: string;
    // ... other fields
}

const RickCard: React.FC<{ rick: Rick }> = ({ rick }) => {
    return (
        <div key={rick.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="bg-gray-200 rounded-lg overflow-hidden">
                <div
                    className="bg-cover bg-center h-48"
                    style={{ backgroundImage: `url(${rick.image})` }}
                />
            </div>
            <dl className="mt-4">
                <dt className="font-semibold">Rick: {rick.name}</dt>
                <dd>Origin: {rick.origin?.name}</dd>
                <dd>Location: {rick.location?.name}</dd>
            </dl>
        </div>
    );
};

export default RickCard;

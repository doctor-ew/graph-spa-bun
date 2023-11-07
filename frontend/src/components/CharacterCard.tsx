// CharacterCard.tsx
import React from 'react';

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

interface CharacterCardProps {
    character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
    console.log('|-o-| character: ',character);
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="bg-gray-200 rounded-lg overflow-hidden">
                <div
                    className="bg-cover bg-center h-48"
                    style={{ backgroundImage: `url(${character.image})` }}
                />
            </div>
            <dl className="mt-4">
                <dt className="font-semibold">Character: {character.name}</dt>
                <dd>Origin: {character.origin?.name}</dd>
                <dd>Location: {character.location?.name}</dd>
            </dl>
        </div>
    );
};

export default CharacterCard;

// CharacterGrid.tsx
import React from 'react';
import CharacterCard from './CharacterCard'; // Import the CharacterCard component

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
    rick: Character;
    morties: Character[];
}

interface CharacterGridProps {
    associations: RickAndMortyAssociations[];
}

const CharacterGrid: React.FC<CharacterGridProps> = ({ associations }) => {

    console.log('|-o-| associations: ',associations);
    return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {associations?.map((association) => (
                <React.Fragment key={association?.rick?.id}>
                    <CharacterCard character={association?.rick} />
                    {association?.morties?.map(morty => (
                        <CharacterCard key={morty?.id} character={morty} />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};

export default CharacterGrid;

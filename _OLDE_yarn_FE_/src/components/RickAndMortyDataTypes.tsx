// RickAndMortyDataTypes.tsx

export interface Origin {
    id: string;
    name: string;
}

export interface Location {
    id: string;
    name: string;
}

export interface Character {
    id: string;
    name: string;
    origin: Origin;
    location: Location;
    image: string;
}

export interface RickAndMortyData {
    rickAndMortyAssociations: {
        rick: Character;
        morties: Character[];
    }[];
}

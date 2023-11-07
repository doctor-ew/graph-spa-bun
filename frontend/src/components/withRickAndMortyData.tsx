// withRickAndMortyData.tsx
import React, { ComponentType } from 'react';

// This HOC is supposed to wrap a component and provide it with RickAndMortyData
export function withRickAndMortyData<P extends { data?: any }>(
    WrappedComponent: ComponentType<P>
): ComponentType<Omit<P, 'data'>> {
    // The HOC component wraps the original component
    const WithRickAndMortyData: React.FC<Omit<P, 'data'>> = (props) => {
        // You can fetch data here if needed and pass it to the WrappedComponent
        // For now, we'll just pass through any props
        return <WrappedComponent {...(props as P)} />;
    };

    // Set a display name for the HOC for easier debugging
    WithRickAndMortyData.displayName = `WithRickAndMortyData(${getDisplayName(WrappedComponent)})`;

    return WithRickAndMortyData;
}

// Helper function to get a display name
function getDisplayName<P>(WrappedComponent: ComponentType<P>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withRickAndMortyData;

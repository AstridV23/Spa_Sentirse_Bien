import React from "react";
import { Wrapper } from "@googlemaps/react-wrapper";

const GoogleMapsWrapper = ({
    children,
    }: {
    children: React.ReactNode;
    }) => {
    const apiKey = import.meta.env.VITE_API_KEY; // Mejor obtener la API Key de las variables de entorno.

    if (!apiKey) {
        return <div>Cannot display the map: google maps api key missing</div>;
    }

    return <Wrapper apiKey={apiKey}>{children}</Wrapper>;
};

export default GoogleMapsWrapper;

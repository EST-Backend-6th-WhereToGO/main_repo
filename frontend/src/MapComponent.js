import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = ({ timeAndPlaces }) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={{ lat: 37.5546, lng: 126.9717 }}
                zoom={12}
            >
                {timeAndPlaces.map((place, index) => (
                    <Marker
                        key={index}
                        position={{ lat: 37.5546 + index * 0.01, lng: 126.9717 + index * 0.01 }}
                        label={place.place}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;

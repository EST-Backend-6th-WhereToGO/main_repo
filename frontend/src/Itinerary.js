import React from "react";

const Itinerary = ({ timeAndPlaces, setSendRemoveList }) => {
    const handleItemClick = (place) => {
        setSendRemoveList((prev) =>
            prev.includes(place)
                ? prev.filter((item) => item !== place)
                : [...prev, place]
        );
    };

    return (
        <div id="trip-order">
            {timeAndPlaces.map((place, index) => (
                <p
                    key={index}
                    className="planOrder"
                    onClick={() => handleItemClick(place)}
                    style={{
                        background: place.selected ? "red" : "white",
                    }}
                >
                    {place.time} - {place.place}
                </p>
            ))}
        </div>
    );
};

export default Itinerary;

import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import Itinerary from "./Itinerary";
import "./TripPlanner.css";

const TripPlanner = ({ startDate, endDate, selectedCity }) => {
    const [timeAndPlaces, setTimeAndPlaces] = useState([]);
    const [sendRemoveList, setSendRemoveList] = useState([]);
    const [aiRequest, setAiRequest] = useState("");
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [myPlanDTO, setMyPlanDTO] = useState({
        startedAt: startDate,
        endedAt: endDate,
        userId: 1, // 예제 사용자 ID, 필요하면 수정
        cityId: selectedCity?.id || 0,
        cityName: selectedCity?.name || "",
    });

    useEffect(() => {
        if (startDate && endDate && selectedCity) {
            const aiQuery = `${selectedCity.name}에서 ${startDate}부터 ${endDate}까지 여행 계획을 만들어 줘`;
            setAiRequest(aiQuery);
            fetchTripData();
        }
    }, [startDate, endDate, selectedCity]);

    const fetchTripData = async () => {
        setLoading(true); // 로딩 시작
        try {
            const response = await fetch("http://localhost:8080/api/searchTrip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    aiRequest,
                    ...myPlanDTO,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch trip data");
            }

            const data = await response.json();
            const obj = JSON.parse(data.content);
            processTripData(obj);
        } catch (error) {
            console.error("Error fetching trip data:", error);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    const processTripData = (obj) => {
        const newTimeAndPlaces = [];
        let dayCount = 0;
        let order = 1;

        Object.keys(obj).forEach((day) => {
            dayCount += 1;
            obj[day].Day.forEach((item) => {
                if (!item["장소"].includes("호텔")) {
                    newTimeAndPlaces.push({
                        time: item["시간"],
                        place: item["장소"],
                        day: dayCount,
                        order: order++,
                    });
                }
            });
        });

        setTimeAndPlaces(newTimeAndPlaces);
    };

    const handleReSearch = async () => {
        const places = sendRemoveList
            .map((item) => item.place)
            .join(", ") + " 일정만 다른 일정으로 바꿔서 다시 추천해주세요.";

        setAiRequest(places);
        fetchTripData();
    };

    const handleSave = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/savePlan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    myTripOrderList: timeAndPlaces,
                    ...myPlanDTO,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save trip plan");
            }

            alert("일정이 저장되었습니다.");
        } catch (error) {
            console.error("Error saving trip plan:", error);
        }
    };

    return (
        <div className="trip-planner">
            <header>
                <h3>여행 일정</h3>
            </header>

            {/* 로딩 중 메시지 */}
            {loading ? (
                <p className="loading-message">잠시만 기다려주세요...</p>
            ) : (
                <>
                    <Itinerary
                        timeAndPlaces={timeAndPlaces}
                        setSendRemoveList={setSendRemoveList}
                    />
                    <div className="controls">
                        <button onClick={handleReSearch}>다시 검색</button>
                        <button onClick={handleSave}>저장</button>
                    </div>
                    <MapComponent timeAndPlaces={timeAndPlaces} />
                </>
            )}
        </div>
    );
};

export default TripPlanner;

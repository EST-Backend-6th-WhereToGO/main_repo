import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './TripPlanner.css';
import Header from "./Header";

function TripPlanner() {
    const location = useLocation();
    const { startDate, endDate, selectedCity, selectedCategory, userId } = location.state || {};
    const [tripPlan, setTripPlan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');
    const containerRef = useRef(null); // 스크롤 컨테이너 참조

    useEffect(() => {
        console.log("Selected City: ", selectedCity);
        console.log("User ID: ", userId);
    }, [selectedCity, userId]);

    useEffect(() => {
        if (!startDate || !endDate || !selectedCity || !selectedCategory || !userId) {
            console.error('Invalid travel information:', {
                startDate, endDate, selectedCity, selectedCategory, userId,
            });
            setError('여행 정보가 올바르지 않습니다.');
            setLoading(false);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
        const daysDescription = `${nights}박 ${nights + 1}일`;

        const aiRequest = `${selectedCategory} 목적으로 ${daysDescription} 동안 ${selectedCity.cityName} 여행 계획을 만들어 줘`;

        const fetchTripPlan = async () => {
            try {
                const response = await fetch('/api/searchTrip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        aiRequest,
                        startedAt: startDate,
                        endedAt: endDate,
                        cityId: selectedCity.cityId,
                        cityName: selectedCity.cityName,
                        userId,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error fetching trip plan: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched tripPlan data:', data);

                if (data.content) {
                    const parsedContent = JSON.parse(data.content);
                    setTripPlan(parsedContent);
                } else {
                    setTripPlan([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trip plan:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTripPlan();
    }, [startDate, endDate, selectedCity, selectedCategory, userId]);

    const handleSavePlan = async () => {
        const formatDateToLocalDate = (date) => {
            if (date instanceof Date) {
                return date.toISOString().slice(0, 10);
            }
            return date;
        };

        const payload = {
            userId,
            startedAt: formatDateToLocalDate(startDate),
            endedAt: formatDateToLocalDate(endDate),
            cityId: selectedCity.cityId,
            cityName: selectedCity.cityName,
            myTripOrderList: tripPlan.flatMap((dayPlan, dayIndex) =>
                dayPlan.Day.map((activity, activityIndex) => ({
                    time: activity.시간,
                    place: activity.장소,
                    day: (dayIndex + 1).toString(),
                    order: (activityIndex + 1).toString(),
                }))
            ),
        };

        console.log("Saving payload:", payload);

        try {
            const response = await fetch('/api/savePlan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error saving trip plan: ${response.status}`);
            }

            setSaveMessage('여행 계획이 성공적으로 저장되었습니다!');
        } catch (error) {
            console.error('Error saving trip plan:', error);
            setSaveMessage('여행 계획 저장에 실패했습니다.');
        }
    };

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (loading) return <div><Header/> <p>로딩 중...</p></div>;
    if (error) return <p>에러 발생: {error}</p>;
    if (!Array.isArray(tripPlan) || tripPlan.length === 0) {
        return <p>여행 계획 데이터를 불러올 수 없습니다.</p>;
    }

    return (

        <div className="trip-planner-container">
            <Header/>
            <h1>여행 계획</h1>
            <div className="navigation-buttons">
                <button onClick={scrollLeft} className="navigation-button">&lt;</button>
                <button onClick={scrollRight} className="navigation-button">&gt;</button>
            </div>
            <div className="day-plan-container" ref={containerRef}>
                {tripPlan.map((dayPlan, dayIndex) => (
                    <div key={dayIndex} className="day-plan">
                        <h2>{`Day ${dayIndex + 1}`}</h2>
                        {Array.isArray(dayPlan.Day) && dayPlan.Day.length > 0 ? (
                            dayPlan.Day.map((activity, activityIndex) => (
                                <div key={activityIndex} className="activity">
                                    <p>{activity.시간}</p>
                                    <p>{activity.장소}</p>
                                </div>
                            ))
                        ) : (
                            <p>일정이 없습니다.</p>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={handleSavePlan} className="save-button">저장</button>
            {saveMessage && <p className="save-message">{saveMessage}</p>}
        </div>
    );
}

export default TripPlanner;

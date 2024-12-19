import React, { useEffect, useState, useRef } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import "./TripPlanner.css";
import Header from "./Header";
import SavePopup from "./SavePopup";

function TripPlanner() {
    const location = useLocation();
    const {
        startDate,
        endDate,
        selectedCity,
        selectedCategory,
        userId,
        detailPlans, // MyPostDetail에서 전달받은 데이터
    } = location.state || {};

    // 데이터를 그룹화하는 함수
    const groupPlansByDay = (plans) => {
        const grouped = {};
        plans.forEach((plan) => {
            const day = plan.day || "1"; // day 정보가 없으면 기본값 "1"로 설정
            if (!grouped[day]) {
                grouped[day] = [];
            }
            grouped[day].push({
                시간: plan.startTime || "시간 정보 없음",
                장소: plan.placeName || "장소 정보 없음",
            });
        });
        // 객체를 배열로 변환하여 반환 (Day 순서대로)
        return Object.entries(grouped)
            .sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB))
            .map(([_, activities]) => ({ Day: activities }));
    };

    const [tripPlan, setTripPlan] = useState(
        detailPlans ? groupPlansByDay(detailPlans) : []
    );
    const [deletedActivities, setDeletedActivities] = useState([]);
    const [loading, setLoading] = useState(!detailPlans); // detailPlans가 없으면 로딩 필요
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState("");
    const containerRef = useRef(null);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!detailPlans) {
            // detailPlans가 없는 경우에만 AI 요청으로 데이터를 가져옴
            if (!startDate || !endDate || !selectedCity || !selectedCategory || !userId) {
                console.error("Invalid travel information:", {
                    startDate,
                    endDate,
                    selectedCity,
                    selectedCategory,
                    userId,
                });
                setError("여행 정보가 올바르지 않습니다.");
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
                    const response = await fetch("/api/searchTrip", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
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
                    console.log("Fetched tripPlan data:", data);

                    if (data.content) {
                        const parsedContent = JSON.parse(data.content);
                        setTripPlan(parsedContent);
                    } else {
                        setTripPlan([]);
                    }
                } catch (error) {
                    console.error("Error fetching trip plan:", error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchTripPlan();
        } else {
            setLoading(false); // detailPlans가 있으면 로딩 중지
        }
    }, [detailPlans, startDate, endDate, selectedCity, selectedCategory, userId]);

    const handleSavePlan = async () => {
        if (deletedActivities.length > 0) {
            setSaveMessage("삭제된 일정이 있는 경우 저장할 수 없습니다.");
            setShowPopup(true);
            return;
        }

        const formatDateToLocalDate = (date) => {
            if (date instanceof Date) {
                return date.toISOString().slice(0, 10);
            }
            return date;
        };

        const payload = {
            planId: location.state?.planId || 0, // Plan ID를 포함
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
        console.log("Payload with planId:", payload);


        try {
            const response = await fetch("/api/savePlan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error saving trip plan: ${response.status}`);
            }

            setSaveMessage("여행 계획이 성공적으로 저장되었습니다!");
        } catch (error) {
            console.error("Error saving trip plan:", error);
            setSaveMessage("여행 계획 저장에 실패했습니다.");
        }finally {
            setShowPopup(true); // 저장 성공/실패 후 팝업 표시
        }
    };

    const handleDeleteActivity = (dayIndex, activityIndex) => {
        const deleted = {
            ...tripPlan[dayIndex].Day[activityIndex],
            day: (dayIndex + 1).toString(),
        };

        tripPlan[dayIndex].Day.splice(activityIndex, 1);
        setDeletedActivities([...deletedActivities, deleted]);
        setTripPlan([...tripPlan]);
    };

    const handleRestoreActivity = (activity) => {
        const dayIndex = Number(activity.day) - 1;

        if (!Array.isArray(tripPlan[dayIndex].Day)) {
            tripPlan[dayIndex].Day = [];
        }

        tripPlan[dayIndex].Day.push(activity);

        tripPlan[dayIndex].Day.sort((a, b) => {
            const timeA = a.시간.replace(":", "");
            const timeB = b.시간.replace(":", "");
            return timeA - timeB;
        });

        setDeletedActivities(deletedActivities.filter((a) => a !== activity));
        setTripPlan([...tripPlan]);
    };

    const handleReRecommend = async () => {
        if (!startDate || !endDate || !selectedCity) {
            console.error("도시 또는 기간 정보가 부족합니다.");
            return;
        }

        const activityPlaces = deletedActivities.map((a) => a.장소).join(", ");
        const start = new Date(startDate);
        const end = new Date(endDate);
        const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
        const daysDescription = `${nights}박 ${nights + 1}일`;

        const aiRequest = `${selectedCity.cityName}에서 ${daysDescription} 동안의 일정 중 ${activityPlaces}를 대체할 새로운 일정을 추천해주세요.`;

        setLoading(true); // 로딩 상태 시작

        try {
            const response = await fetch("/api/searchTrip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                throw new Error(`Error fetching re-recommended plan: ${response.status}`);
            }

            const data = await response.json();
            if (data.content) {
                const parsedContent = JSON.parse(data.content);
                setTripPlan(parsedContent);
                setDeletedActivities([]); // 삭제된 일정 초기화
            }
        } catch (error) {
            console.error("Error re-recommending plan:", error);
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };


    const handleClosePopup = () => {
        setShowPopup(false);
        navigate("/"); // 확인 버튼 클릭 시 "/"로 이동
    };


    useEffect(() => {
        console.log("Received location state:", {
            startDate,
            endDate,
            selectedCity,
            selectedCategory,
            userId,
            detailPlans,
        });

        if (!detailPlans) {
            console.log("Fetching AI-based trip plan...");
            // AI 요청 로직 그대로 유지
        }
    }, [detailPlans, startDate, endDate, selectedCity, selectedCategory, userId]);


    if (loading) {
        return (
            <>
                <div className="loading-overlay">
                    <Header/>
                    <div className="loader-container">
                        <RotatingLines height="100" width="100" color="#fff" ariaLabel="loading"/>
                        <p className="loader-message">로딩 중...</p>
                    </div>
                </div>
            </>
        );
    }

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({left: -300, behavior: "smooth"});
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({left: 300, behavior: "smooth" });
        }
    };


    if (error) return <p>에러 발생: {error}</p>;

    if (!Array.isArray(tripPlan) || tripPlan.length === 0) {
        return <p>여행 계획 데이터를 불러올 수 없습니다.</p>;
    }

    return (
        <div className="trip-planner-container">
            <Header />
            <h1>여행 계획</h1>
            <button
                onClick={handleReRecommend}
                className="re-recommend-button"
                disabled={deletedActivities.length === 0}
            >
                다시 검색
            </button>
            <div className="navigation-buttons">
                <button onClick={scrollLeft} className="navigation-button">
                    &lt;
                </button>
                <button onClick={scrollRight} className="navigation-button">
                    &gt;
                </button>
            </div>
            <div className="day-plan-container" ref={containerRef}>
                {tripPlan.map((dayPlan, dayIndex) => (
                    <div key={dayIndex} className="day-plan">
                        <h2>{`Day ${dayIndex + 1}`}</h2>
                        {dayPlan.Day.map((activity, activityIndex) => (
                            <div
                                key={activityIndex}
                                className="activity"
                                onClick={() => handleDeleteActivity(dayIndex, activityIndex)}
                            >
                                <p>{activity.시간}</p>
                                <p>{activity.장소}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {deletedActivities.length > 0 && (
                <div className="deleted-activities">
                    <h2>삭제된 일정</h2>
                    {deletedActivities.map((activity, index) => (
                        <div
                            key={index}
                            className="deleted-activity"
                            onClick={() => handleRestoreActivity(activity)}
                        >
                            <p>{activity.시간}</p>
                            <p>{activity.장소}</p>
                        </div>
                    ))}
                </div>
            )}
            <button
                onClick={handleSavePlan}
                className="save-button"
                disabled={deletedActivities.length > 0}
            >
                저장
            </button>
            {saveMessage && showPopup && (
                <SavePopup message={saveMessage} onClose={handleClosePopup} />
            )}
        </div>
    );
}

export default TripPlanner;

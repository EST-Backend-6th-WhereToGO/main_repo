import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyPostDetail.css";
import Header from "./Header";

const MyPostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [detailPlans, setDetailPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await axios.get(`/mypage/post/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                console.log("Post data fetched:", postResponse.data);
                setPost(postResponse.data);

                const planId = postResponse.data.planId;
                if (planId) {
                    const planResponse = await axios.get(`/api/plan/${planId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                        },
                    });

                    const planData = planResponse.data;
                    console.log("Plan data fetched:", planData);

                    // Plan 데이터를 post 객체에 추가 (cityId, cityName 변환)
                    setPost((prevPost) => ({
                        ...prevPost,
                        startDate: planData.startDate,
                        endDate: planData.endDate,
                        city: {
                            cityId: planData.city.id, // 백엔드의 `id`를 `cityId`로 설정
                            cityName: planData.city.name, // 백엔드의 `name`을 `cityName`으로 설정
                        },
                        category: planData.category,
                    }));

                    const detailResponse = await axios.get(`/mypage/plan/${planId}/details`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                        },
                    });
                    console.log("Detail Plans fetched:", detailResponse.data);
                    setDetailPlans(detailResponse.data);
                }
            } catch (err) {
                console.error("Error fetching post or plan details:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleEdit = () => {
        if (!post || !post.startDate || !post.endDate || !post.city) {
            console.error("Incomplete post data. Please ensure all required fields are available:", post);
            return;
        }

        const navigateState = {
            planId: post.planId, // Plan ID를 추가
            startDate: post.startDate,
            endDate: post.endDate,
            selectedCity: {
                cityId: post.city.cityId,
                cityName: post.city.cityName,
            },
            selectedCategory: post.category,
            userId: post.userId,
            detailPlans,
        };

        console.log("Navigating to /tripplan with state:", navigateState);

        navigate("/tripplan", {
            state: navigateState,
        });
    };


    const groupByDay = (plans) => {
        return plans.reduce((acc, plan) => {
            const day = plan.day || "Unknown";
            if (!acc[day]) acc[day] = [];
            acc[day].push(plan);
            return acc;
        }, {});
    };

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Failed to load data. Please try again later.</p>;

    const groupedPlans = groupByDay(detailPlans);

    return (
        <div className="post-detail-container">
            <Header />
            <div className="post-info">
                <h1>{post.title}</h1>
                <p>{post.content}</p>
                <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="detail-plan-container">
                <h2>Detail Plans</h2>
                <div className="navigation-buttons">
                    <button onClick={scrollLeft} className="navigation-button">&lt;</button>
                    <button onClick={scrollRight} className="navigation-button">&gt;</button>
                </div>
                <div className="day-plan-container" ref={containerRef}>
                    {Object.entries(groupedPlans).map(([day, plans]) => (
                        <div key={day} className="day-plan">
                            <h2>{`Day ${day}`}</h2>
                            {plans.map((plan, index) => (
                                <div key={index} className="activity">
                                    <p>{plan.startTime || "시간 정보 없음"}</p>
                                    <p>{plan.placeName || "장소 이름 없음"}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleEdit} className="edit-button">
                수정
            </button>
        </div>
    );
};

export default MyPostDetail;

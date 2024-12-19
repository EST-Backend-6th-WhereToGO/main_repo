import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MyPostDetail.css";
import Header from "./Header";
import SharePopup from "./SharePopup";

const MyPostDetail = () => {
    const { postId } = useParams(); // URL에서 postId 가져오기
    const [post, setPost] = useState(null); // 게시글 데이터
    const [detailPlans, setDetailPlans] = useState([]); // Detail Plan 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(false); // 에러 상태
    const containerRef = useRef(null); // 스크롤 컨테이너 참조
    const [isSharePopupOpen, setIsSharePopupOpen] = useState(false); // 팝업 상태 관리
    const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물

    const openSharePopup = (post) => {
        setSelectedPost(post);
        setIsSharePopupOpen(true);
    };

    const closePopup = () => {
        setSelectedPost(null);
        setIsSharePopupOpen(false);
    };



    // 게시글 정보 가져오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                // 게시글 데이터 가져오기
                const postResponse = await axios.get(`/mypage/post/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                console.log("Post data fetched:", postResponse.data);
                setPost(postResponse.data);

                // 게시글의 planId 확인 후 detail_plan 데이터 가져오기
                const planId = postResponse.data.planId;
                if (planId) {
                    console.log("Fetching detail plans for planId:", planId);
                    const detailResponse = await axios.get(`/mypage/plan/${planId}/details`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                        },
                    });
                    console.log("Detail Plan data fetched:", detailResponse.data);
                    setDetailPlans(detailResponse.data);
                } else {
                    console.log("No planId found for the post.");
                }
            } catch (err) {
                console.error("Failed to fetch post or detail plans:", err);
                setError(true);
            } finally {
                setLoading(false); // 로딩 상태 업데이트
            }
        };

        fetchPost();
    }, [postId]);

    const groupByDay = (plans) => {
        return plans.reduce((acc, plan) => {
            const day = plan.day || "Unknown";
            if (!acc[day]) {
                acc[day] = [];
            }
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


    // 로딩 중
    if (loading) return <p>Loading...</p>;

    // 에러 발생
    if (error) return <p>Failed to load data. Please try again later.</p>;

    const groupedPlans = groupByDay(detailPlans);

    return (
        <div className="post-detail-container">
            {/* 게시글 정보 */}
            <Header />
            <div className="post-info">
                <h1>{post.title}</h1>
                <p>{post.content}</p>
                <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>

            {/* 공유 버튼 추가 */}
            <div className="share-button-container">
                <button onClick={() => setIsSharePopupOpen(true)}>
                    일정 공유 여부 설정
                </button>
            </div>

            {/* Detail Plan 정보 */}
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
        </div>
    );
};

export default MyPostDetail;

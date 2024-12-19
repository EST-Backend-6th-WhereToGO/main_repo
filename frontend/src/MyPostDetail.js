import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MyPostDetail.css";
import Header from "./Header";

const MyPostDetail = () => {
    const { postId } = useParams(); // URL에서 postId 가져오기
    const [post, setPost] = useState(null); // 게시글 데이터
    const [detailPlans, setDetailPlans] = useState([]); // Detail Plan 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(false); // 에러 상태

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

    // 로딩 중
    if (loading) return <p>Loading...</p>;

    // 에러 발생
    if (error) return <p>Failed to load data. Please try again later.</p>;

    return (
        <div className="post-detail-container">
            {/* 게시글 정보 */}
            <Header/>
            <div className="post-info">
                <h1>{post.title}</h1>
                <p>{post.content}</p>
                <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Detail Plan 정보 */}
            <div className="detail-plan-container">
                <h2>Detail Plans</h2>
                {detailPlans.length > 0 ? (
                    <ul className="detail-plan-list">
                        {detailPlans.map((detail) => (
                            <li key={detail.detailId} className="detail-item">
                                <h3>{detail.day ? detail.day + " 일차" : "일차 정보 없음"}</h3>
                                <p>{detail.placeName || "장소 이름 없음"}</p>
                                <p>
                                    일정시간:{" "}
                                    <strong>{detail.startTime || "시간 정보 없음"}</strong>
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No detail plans available.</p>
                )}
            </div>
        </div>
    );
};

export default MyPostDetail;

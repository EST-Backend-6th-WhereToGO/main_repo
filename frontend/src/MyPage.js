import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { Card, CardContent, Typography, Avatar, Box, CircularProgress } from "@mui/material";
import "./MyPage.css";

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null); // 회원 정보 상태
    const [loadingUser, setLoadingUser] = useState(true); // 회원 정보 로딩 상태
    const [tipPosts, setTipPosts] = useState([]);
    const [tripPosts, setTripPosts] = useState([]);
    const [loadingTip, setLoadingTip] = useState(true);
    const [loadingTrip, setLoadingTrip] = useState(true);
    const navigate = useNavigate();

    // 회원 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get("/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                setUserInfo(response.data);
                setLoadingUser(false);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                setLoadingUser(false);
            }
        };

        fetchUserInfo();
    }, []);

    // TIP 게시물 가져오기
    useEffect(() => {
        const fetchTipPosts = async () => {
            try {
                const response = await axios.get("/mypage/tip", {
                    params: { page: 0 },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                setTipPosts(response.data.content);
                setLoadingTip(false);
            } catch (error) {
                console.error("Failed to fetch TIP posts:", error);
                setLoadingTip(false);
            }
        };

        fetchTipPosts();
    }, []);

    // TRIP 게시물 가져오기
    useEffect(() => {
        const fetchTripPosts = async () => {
            try {
                const response = await axios.get("/mypage/trip", {
                    params: { page: 0 },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                setTripPosts(response.data.content);
                setLoadingTrip(false);
            } catch (error) {
                console.error("Failed to fetch TRIP posts:", error);
                setLoadingTrip(false);
            }
        };

        fetchTripPosts();
    }, []);

    return (
        <div className="mypage-container">
            <Header />

            {/* 회원 정보 섹션 */}
            <div className="profile-section">
                {loadingUser ? (
                    <CircularProgress />
                ) : userInfo ? (
                    <Card
                        sx={{
                            maxWidth: 600,
                            margin: "20px auto",
                            padding: "20px",
                            textAlign: "center", // 텍스트 중앙 정렬
                        }}
                    >
                        {/* 닉네임 */}
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ marginBottom: 2 }}
                        >
                            {userInfo.nickname}
                        </Typography>

                        {/* 다른 정보들 */}
                        <CardContent>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>나이:</strong> {userInfo.age}세
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>성별:</strong> {userInfo.gender}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>MBTI:</strong> {userInfo.mbti || "미입력"}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                <strong>지역:</strong> {userInfo.region}, {userInfo.city}
                            </Typography>
                            {/* 수정 버튼 */}
                            {/* 수정 버튼 */}
                            <button
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => navigate('/edit-profile')} // 수정 페이지로 이동
                            >
                                수정
                            </button>
                        </CardContent>
                    </Card>
                ) : (
                    <p>회원 정보를 불러올 수 없습니다.</p>
                )}
            </div>


            {/* TIP 게시물 */}
            <div className="mypage-section">
                <h2 className="section-title">TIP Posts</h2>
                {loadingTip ? (
                    <p>Loading TIP posts...</p>
                ) : tipPosts.length > 0 ? (
                    <ul className="post-list">
                        {tipPosts.slice(0, 5).map((post) => (
                            <li
                                key={post.postId}
                                className="post-item"
                                onClick={() =>
                                    navigate(`/post/${post.postId}`, {
                                        state: { title: post.title, content: post.content },
                                    })
                                }
                            >
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-date">작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No TIP posts available.</p>
                )}
            </div>

            {/* TRIP 게시물 */}
            <div className="mypage-section">
                <h2 className="section-title">TRIP Posts</h2>
                {loadingTrip ? (
                    <p>Loading TRIP posts...</p>
                ) : tripPosts.length > 0 ? (
                    <ul className="post-list">
                        {tripPosts.slice(0, 5).map((post) => (
                            <li
                                key={post.postId}
                                className="post-item"
                                onClick={() => navigate(`/plan/${post.postId}`)}
                            >
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-date">작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No TRIP posts available.</p>
                )}
            </div>
        </div>
    );
};

export default MyPage;

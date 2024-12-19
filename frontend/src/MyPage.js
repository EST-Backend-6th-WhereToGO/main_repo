import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가
import axios from "axios";
import './MyPage.css';
import Header from "./Header";

const MyPage = () => {
    const [tipPosts, setTipPosts] = useState([]); // TIP 게시물 상태
    const [tripPosts, setTripPosts] = useState([]); // TRIP 게시물 상태
    const [showAllTipPosts, setShowAllTipPosts] = useState(false); // TIP 더보기 상태
    const [showAllTripPosts, setShowAllTripPosts] = useState(false); // TRIP 더보기 상태
    const [loadingTip, setLoadingTip] = useState(true); // TIP 로딩 상태
    const [loadingTrip, setLoadingTrip] = useState(true); // TRIP 로딩 상태
    const navigate = useNavigate(); // useNavigate 훅 초기화

    useEffect(() => {
        // TIP 게시물 가져오기
        const fetchTipPosts = async () => {
            try {
                setLoadingTip(true);
                const response = await axios.get("/mypage/tip", {
                    params: { page: 0 }, // 첫 페이지만 가져오기
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

    useEffect(() => {
        // TRIP 게시물 가져오기
        const fetchTripPosts = async () => {
            try {
                setLoadingTrip(true);
                const response = await axios.get("/mypage/trip", {
                    params: { page: 0 }, // 첫 페이지만 가져오기
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

    const fetchAllTipPosts = async () => {
        try {
            setLoadingTip(true);
            const response = await axios.get("/mypage/tip", {
                params: { page: 0, size: 100 }, // 전체 게시물 가져오기
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            setTipPosts(response.data.content);
            setShowAllTipPosts(true); // 더보기 상태 업데이트
            setLoadingTip(false);
        } catch (error) {
            console.error("Failed to fetch all TIP posts:", error);
            setLoadingTip(false);
        }
    };

    const fetchAllTripPosts = async () => {
        try {
            setLoadingTrip(true);
            const response = await axios.get("/mypage/trip", {
                params: { page: 0, size: 100 }, // 전체 게시물 가져오기
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            setTripPosts(response.data.content);
            setShowAllTripPosts(true); // 더보기 상태 업데이트
            setLoadingTrip(false);
        } catch (error) {
            console.error("Failed to fetch all TRIP posts:", error);
            setLoadingTrip(false);
        }
    };
    useEffect(() => {
        console.log("TIP Posts:", tipPosts); // TIP 게시물 데이터 확인
    }, [tipPosts]);

    return (
        <div className="mypage-container">
            <Header/>
            <div className="mypage-header">
                <h1>내 게시물 조회</h1>
            </div>

            {/* TIP 게시물 */}
            <div className="mypage-section">
                <h2 className="section-title">TIP Posts</h2>
                {loadingTip ? (
                    <p>Loading TIP posts...</p>
                ) : tipPosts.length > 0 ? (
                    <ul className="post-list">
                        {(showAllTipPosts ? tipPosts : tipPosts.slice(0, 5)).map((post) => (
                            <li
                                key={post.postId}
                                className="post-item"
                                onClick={() =>
                                    navigate(`/create-post`, {
                                        state: {
                                            postId:post.postId,
                                            title: post.title,
                                            content: post.content,
                                            header: post.header,
                                        },
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
                {!showAllTipPosts && tipPosts.length > 5 && (
                    <button onClick={fetchAllTipPosts} className="more-button">
                        더보기
                    </button>
                )}
            </div>

            {/* TRIP 게시물 */}
            <div className="mypage-section">
                <h2 className="section-title">TRIP Posts</h2>
                {loadingTrip ? (
                    <p>Loading TRIP posts...</p>
                ) : tripPosts.length > 0 ? (
                    <ul className="post-list">
                        {(showAllTripPosts ? tripPosts : tripPosts.slice(0, 5)).map((post) => (
                            <li
                                key={post.postId}
                                className="post-item"
                                onClick={() => navigate(`/mypage/post/${post.postId}`)}
                            >
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-date">작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No TRIP posts available.</p>
                )}
                {!showAllTripPosts && tripPosts.length > 5 && (
                    <button onClick={fetchAllTripPosts} className="more-button">
                        더보기
                    </button>
                )}
            </div>
        </div>
    );
};

export default MyPage;

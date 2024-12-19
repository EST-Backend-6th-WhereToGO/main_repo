import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가
import axios from "axios";
import './MyPage.css';

const MyPage = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // useNavigate 훅 초기화

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/mypage", {
                    params: { page: currentPage },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                console.log("Fetched posts:", response.data.content);
                setPosts(response.data.content);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, [currentPage]);

    // TIP과 TRIP 게시물 분리
    const tipPosts = posts.filter(post => post.header === "TIP");
    const tripPosts = posts.filter(post => post.header === "TRIP");

    return (
        <div className="mypage-container">
            <div className="mypage-header">
                <h1>내 게시물 조회</h1>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="mypage-content">
                    {/* TIP 게시물 */}
                    <div className="mypage-section">
                        <h2 className="section-title">TIP Posts</h2>
                        {tipPosts.length > 0 ? (
                            <ul className="post-list">
                                {tipPosts.map((post) => (
                                    <li
                                        key={post.postId}
                                        className="post-item"
                                        onClick={() => navigate(`/post/${post.postId}`)} // 클릭 시 postId로 이동
                                    >
                                        <h3 className="post-title">{post.title}</h3>
                                        <p className="post-content">{post.content}</p>
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
                        {tripPosts.length > 0 ? (
                            <ul className="post-list">
                                {tripPosts.map((post) => (
                                    <li
                                        key={post.postId}
                                        className="post-item"
                                        onClick={() => navigate(`/post/${post.postId}`)} // 클릭 시 postId로 이동
                                    >
                                        <h3 className="post-title">{post.title}</h3>
                                        <p className="post-content">{post.content}</p>
                                        <p className="post-date">작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No TRIP posts available.</p>
                        )}
                    </div>
                </div>
            )}

            {/* 페이지 네비게이션 */}
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    className="pagination-button"
                >
                    이전
                </button>
                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="pagination-button"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default MyPage;

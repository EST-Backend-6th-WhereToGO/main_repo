import React, {useState, useEffect, useRef, useCallback} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MyPostDetail.css";
import Header from "./Header";
import {Box, Button, TextField, Typography} from "@mui/material";

const MyPostDetail = () => {
    const { postId } = useParams(); // URL에서 postId 가져오기
    const [post, setPost] = useState(null); // 게시글 데이터
    const [detailPlans, setDetailPlans] = useState([]); // Detail Plan 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(false); // 에러 상태
    const containerRef = useRef(null); // 스크롤 컨테이너 참조
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(""); // 댓글 입력 상태
    const [userId, setUserId] = useState(null);

    const fetchSessionUser = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/status', {
                credentials: 'include',
            });
            const data = await response.json();
            if (data.status === 'LoggedIn') {
                setUserId(data.userId);
            }
        } catch (error) {
            console.error('Failed to fetch session user:', error);
        }
    }, []);

    useEffect(() => {
        fetchSessionUser();
    }, [fetchSessionUser]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            alert("댓글을 입력하세요.");
            return;
        }

        console.log("userId: " + userId)
        console.log("postId: " + postId)
        if (!userId) {
            alert("로그인 정보가 없습니다.");
            return;
        }
        console.log("userId: " + userId)
        console.log("postId: " + postId)
        try {
            const response = await axios.post(
                `/api/comments`, // Spring Boot의 경로와 일치하도록 수정
                {
                    postId, // postId를 포함하여 전송
                    userId, // userId 추가
                    content: newComment, // 댓글 내용
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            // 댓글 작성 후 목록 갱신
            setComments((prevComments) => [...prevComments, response.data]);
            setNewComment(""); // 댓글 입력창 초기화
        } catch (error) {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성 중 문제가 발생했습니다.");
        }
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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/post/${postId}/comments`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                setComments(response.data); // 댓글 데이터를 상태에 저장
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };

        fetchComments();
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
            <Header/>
            <div className="post-info">
                <h1>{post.title}</h1>
                <p>{post.content}</p>
                <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
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

            <div className="comments-section">
                <h2>댓글</h2>
                <Typography variant="h6">댓글 {comments.length}</Typography>
                <Box display="flex" flexDirection="column" gap={2} marginBottom={3}>
                    <TextField
                        label="댓글을 입력하세요"
                        multiline
                        rows={4}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <Button onClick={handleCommentSubmit} variant="contained" color="primary">
                        댓글 작성
                    </Button>
                </Box>
                {comments.length === 0 ? (
                    <p>아직 댓글이 없습니다.</p>
                ) : (
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.commentId} className="comment">
                                <p><strong>{comment.nickname}</strong>: {comment.content}</p>
                                <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MyPostDetail;

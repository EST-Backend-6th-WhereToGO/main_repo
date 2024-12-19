
import React, {useState, useEffect, useRef, useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
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

            {/* 게시글 정보 */}
            <Header/>

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

            {post.userId === userId && (
                <button onClick={handleEdit} className="edit-button">
                    수정
                </button>
            )}

        </div>
    );
};

export default MyPostDetail;

import React, {useState, useEffect, useRef, useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyPostDetail.css";
import Header from "./Header";
import SharePopup from "./SharePopup";
import {Box, Button, TextField, Typography} from "@mui/material";
import { ThumbUp, ThumbDown, Edit, Delete } from '@mui/icons-material';

const MyPostDetail = () => {
    const { postId } = useParams(); // URL에서 postId 가져오기
    const [post, setPost] = useState(null); // 게시글 데이터
    const [detailPlans, setDetailPlans] = useState([]); // Detail Plan 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(false); // 에러 상태
    const containerRef = useRef(null); // 스크롤 컨테이너 참조
    const [isSharePopupOpen, setIsSharePopupOpen] = useState(false); // 팝업 상태 관리

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(""); // 댓글 입력 상태
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [likeCount, setLikeCount] = useState(0);

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

    const updatePlanPublicStatus = async (isShared) => {
        if (!post?.planId) {
            alert("유효한 계획 ID가 없습니다.");
            return;
        }

        try {
            const response = await axios.post(
                "/api/plan/update-public",
                {
                    planId: post.planId,
                    isPublic: isShared ? 1 : 0, // 1 for 공유, 0 for 공유 안함
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                alert(isShared ? "공유 설정이 완료되었습니다!" : "공유 설정이 취소되었습니다!");
            }
        } catch (error) {
            console.error("Failed to update public status:", error);
            alert("공유 상태 업데이트에 실패했습니다.");
        }
    };

    const handleShareConfirm = (isShared) => {
        updatePlanPublicStatus(isShared);
        setIsSharePopupOpen(false);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            alert("댓글을 입력하세요.");
            return;
        }

        try {
            const response = await axios.post(
                `/api/comments`,
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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await axios.get(`/mypage/post/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                setPost(postResponse.data);

                const planId = postResponse.data.planId;
                if (planId) {
                    const planResponse = await axios.get(`/api/plan/${planId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                        },
                    });

                    const planData = planResponse.data;

                    setPost((prevPost) => ({
                        ...prevPost,
                        startDate: planData.startDate,
                        endDate: planData.endDate,
                        city: {
                            cityId: planData.city.id,
                            cityName: planData.city.name,
                        },
                        category: planData.category,
                    }));

                    const detailResponse = await axios.get(`/mypage/plan/${planId}/details`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                        },
                    });
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

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/posts/${postId}`).then((res) => res.json()),
                    fetch(`http://localhost:8080/api/post/${postId}/comments`, { credentials: 'include' }).then((res) => res.json()),
                ]);
                setPost(postRes);
                setLikeCount(postRes.likeCount);
                setComments(commentsRes);
                if (userId) {
                    const likeStatusRes = await fetch(
                        `http://localhost:8080/api/posts/${postId}/like/status?userId=${userId}`,
                        { credentials: 'include' }
                    ).then((res) => res.json());
                    setLiked(likeStatusRes);
                }
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };
        if (userId) {
            fetchPostData();
        }
    }, [postId, userId]);

    // 좋아요 버튼 클릭 처리
    const handleLikeClick = () => {
        if (!userId) {
            alert('로그인이 필요합니다.');
            return;
        }
        const method = liked ? 'DELETE' : 'POST';
        fetch(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`, { method, credentials: 'include' })
            .then(() => {
                setLiked((prev) => !prev);
                setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
            })
            .catch((error) => console.error(error));
    };

    const handleEdit = () => {
        if (!post || !post.startDate || !post.endDate || !post.city) {
            console.error("Incomplete post data. Please ensure all required fields are available:", post);
            return;
        }

        const navigateState = {
            planId: post.planId,
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
                <h1>{post?.title}</h1>
                <p>{post?.content}</p>
                <p>작성일: {new Date(post?.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="share-button-container">
                <button onClick={() => setIsSharePopupOpen(true)}>
                    일정 공유 여부 설정
                </button>
            </div>
            <SharePopup
                isOpen={isSharePopupOpen}
                onClose={() => setIsSharePopupOpen(false)}
                onConfirm={handleShareConfirm}
            />

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
            <div>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLikeClick}
                    startIcon={liked ? <ThumbDown /> : <ThumbUp />}
                >
                    {liked ? "좋아요 취소" : "좋아요"} ({likeCount})
                </Button>
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

            {post?.userId === userId && (
                <button onClick={handleEdit} className="edit-button">
                    수정
                </button>
            )}
        </div>
    );
};

export default MyPostDetail;

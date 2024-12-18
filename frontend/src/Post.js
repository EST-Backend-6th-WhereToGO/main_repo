import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "./Header";
import "./Post.css";

function Post() {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // 세션에서 가져온 사용자 ID
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const navigate = useNavigate();
    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const handleWriteClick = () => navigate("/create-post");
    // 1. 사용자 세션 정보 가져오기
    const fetchSessionUser = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/status", {
                credentials: "include",
            });
            const data = await response.json();

            if (data.status === "LoggedIn") {
                setUserId(data.userId);
            } else {
                setUserId(null);
            }
        } catch (error) {
            console.error("Failed to fetch session user:", error);
            setError("세션 정보를 불러오는데 실패했습니다.");
        }
    };

    // 2. 게시글, 댓글, 좋아요 상태 가져오기
    const fetchPostData = async (uid) => {
        try {
            const [postResponse, commentsResponse] = await Promise.all([
                fetch(`http://localhost:8080/api/posts/${postId}`).then((res) => res.json()),
                fetch(`http://localhost:8080/api/post/${postId}/comments`, {
                    credentials: "include",
                }).then((res) => res.json()),
            ]);

            setPost(postResponse);
            setLikeCount(postResponse.likeCount);
            setComments(commentsResponse);

            // 좋아요 상태 확인
            if (uid) {
                const likeResponse = await fetch(
                    `http://localhost:8080/api/posts/${postId}/like/status?userId=${uid}`,
                    {credentials: "include"}
                ).then((res) => res.json());
                setLiked(likeResponse);
            }
        } catch (error) {
            console.error("Error fetching post data:", error);
            setError("데이터를 불러오는데 실패했습니다.");
        }
    };

    // 3. 좋아요 클릭 처리
    const handleLikeClick = () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const url = `http://localhost:8080/api/posts/${postId}/like?userId=${userId}`;
        const method = liked ? "DELETE" : "POST";

        fetch(url, {method, credentials: "include"})
            .then(() => {
                setLiked((prev) => !prev);
                setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
            })
            .catch((error) => setError(error.message));
    };

    // 4. 댓글 작성
    const handleCommentSubmit = () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (newComment.trim() === "") return;

        const commentData = {postId, content: newComment, userId};

        fetch("http://localhost:8080/api/comments", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify(commentData),
        })
            .then((response) => response.json())
            .then((newComment) => {
                setComments([...comments, newComment]);
                setNewComment("");
            })
            .catch((error) => setError(error.message));
    };

    // 5. 페이지 로드 시 사용자 정보 가져오기
    useEffect(() => {
        const loadData = async () => {
            await fetchSessionUser();
        };
        loadData();
    }, []);

    // 6. userId 설정 후 데이터 가져오기
    useEffect(() => {
        if (userId !== null) {
            fetchPostData(userId);
        }
    }, [userId, postId]);

    const handleDeleteComment = (commentId) => {
        if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

        fetch(`http://localhost:8080/api/comments/${commentId}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    // 댓글 목록에서 삭제된 댓글 제거
                    setComments((prevComments) =>
                        prevComments.filter((comment) => comment.commentId !== commentId)
                    );
                } else {
                    alert("댓글 삭제 권한이 없거나 오류가 발생했습니다.");
                }
            })
            .catch((error) => {
                console.error("Error deleting comment:", error);
                alert("댓글 삭제 중 오류가 발생했습니다.");
            });
    };

    const handleDeletePost = () => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

        fetch(`http://localhost:8080/api/posts/${postId}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    alert("게시글이 삭제되었습니다.");
                    navigate("/"); // 삭제 후 메인 페이지로 이동
                } else {
                    alert("게시글 삭제 권한이 없거나 오류가 발생했습니다.");
                }
            })
            .catch((error) => {
                console.error("Error deleting post:", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            });
    };
    const handleEditClick = (comment) => {
        setEditCommentId(comment.commentId); // 수정할 댓글 ID 설정
        setEditContent(comment.content);     // 기존 댓글 내용 가져오기
    };

    const handleEditSubmit = (commentId) => {
        if (editContent.trim() === "") return;

        fetch(`http://localhost:8080/api/comments/${commentId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({content: editContent}) // 수정된 댓글 내용 전송
        })
            .then((response) => response.json())
            .then((updatedComment) => {
                // 수정된 댓글로 상태 업데이트
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.commentId === commentId ? updatedComment : comment
                    )
                );
                setEditCommentId(null); // 수정 모드 해제
                setEditContent("");     // 입력 필드 초기화
            })
            .catch((error) => {
                console.error("Error updating comment:", error);
                alert("댓글 수정 중 오류가 발생했습니다.");
            });
    };

    const handleEditPost = () => {
        // 게시글 수정 페이지로 이동하면서 데이터 전달
        navigate("/create-post", {
            state: {
                postId: postId,       // 수정할 게시글 ID
                title: post.title,    // 기존 제목
                content: post.content, // 기존 내용
                header: post.header,  // 기존 카테고리 (Enum 값)
            },
        });
    };



    if (error) return <div>에러 발생: {error}</div>;
    if (!post) return <div>로딩 중...</div>;

    return (
        <div className="post-page">
            <Header/>
            <div className="post-container">
                {userId === post.userId && (
                    <div className="edit-delete-buttons">
                        <button className="edit-button" onClick={handleEditPost}>수정</button>
                        <button className="delete-button" onClick={handleDeletePost}>삭제</button>
                    </div>
                )}

                {/* 제목 */}
                <div className="post-title">
                    <h1>{post.title}</h1>
                </div>

                {/* 메타 정보 */}
                <div className="post-meta">
                    <div className="meta-left">{post.nickname}</div>
                    <div className="meta-center">
                        {post.updatedAt && post.updatedAt !== post.createdAt
                            ? `${new Date(post.updatedAt).toLocaleString()} (수정)`
                            : new Date(post.createdAt).toLocaleString()}
                    </div>
                    <div className="meta-right">
                        <span>조회수: {post.viewCount}</span>
                        <span>좋아요: {likeCount}</span>
                    </div>
                </div>

                {/* 내용 */}
                <div className="post-content">
                    <p>{post.content}</p>
                </div>

                {/* 좋아요 버튼 */}
                <button
                    className={`like-button ${liked ? "liked" : ""}`}
                    onClick={handleLikeClick}
                >
                    {liked ? "좋아요 취소" : "좋아요"} ({likeCount})
                </button>

                {/* 댓글 섹션 */}
                <div className="comments-section">
                    <h3>댓글 {comments.length}</h3>
                    <div className="comment-input">
                        <textarea
                            placeholder="댓글을 입력하세요..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button onClick={handleCommentSubmit}>댓글 작성</button>
                    </div>
                    {comments.map((comment) => (
                        <div key={comment.commentId} className="comment-item">
                            <div className="comment-header">
                                <span>{comment.nickname}</span>
                                <span>
                                    {comment.updatedAt && comment.updatedAt !== comment.createdAt
                                        ? `${new Date(comment.updatedAt).toLocaleString()} (수정됨)`
                                        : new Date(comment.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="comment-sub">
                                {/* 수정 모드인지 확인 */}
                                {editCommentId === comment.commentId ? (
                                    <>
                                        {/* 수정 중인 경우 textarea 표시 */}
                                        <textarea className="edit-comment-textarea"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                        <div className="comment-sub-button">
                                            <button
                                                className="save-comment-button"
                                                onClick={() => handleEditSubmit(comment.commentId)}
                                            >
                                                저장
                                            </button>
                                            <button
                                                className="cancel-comment-button"
                                                onClick={() => {
                                                    setEditCommentId(null);
                                                    setEditContent("");
                                                }}
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* 일반 모드: 댓글 내용 표시 */}
                                        <div className="comment-content">{comment.content}</div>
                                        {userId === comment.userId && (
                                            <div className="comment-sub-button">
                                                <button
                                                    className="edit-comment-button"
                                                    onClick={() => handleEditClick(comment)} // 수정 버튼 클릭
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    className="delete-comment-button"
                                                    onClick={() => handleDeleteComment(comment.commentId)}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="button-section">
                    <button onClick={() => navigate("/board")}>목록</button>
                    <button className="action-button" onClick={handleWriteClick}>
                        글쓰기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Post;

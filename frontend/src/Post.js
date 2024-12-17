import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import Header from "./Header";
import "./Post.css";

function Post() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);
    const isFetched = useRef(false);
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [likeCount, setLikeCount] = useState(0); // 좋아요 수
    const handleWriteClick = () => {
        navigate('/post/write'); // 새 글쓰기 페이지로 이동
    };

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        // 게시글 데이터, 좋아요 상태, 댓글 불러오기
        Promise.all([
            fetch(`http://localhost:8080/api/posts/${postId}`)
                .then((response) => response.json()),
            fetch(`http://localhost:8080/api/posts/${postId}/like/status?userId=2`)
                .then((response) => response.json()),
            fetch(`http://localhost:8080/api/post/${postId}/comments`)
                .then((response) => response.json())
        ])
            .then(([postData, likeStatusData, commentsData]) => {
                setPost(postData);
                setLikeCount(postData.likeCount); // 조회수, 좋아요 카운트 설정
                setLiked(likeStatusData.liked);   // 좋아요 상태 설정
                setComments(commentsData);        // 댓글 설정
            })
            .catch((error) => setError(error.message));
    }, [postId]);

    const handleCommentSubmit = () => {
        if (newComment.trim() === "") return; // 빈 댓글 방지

        const commentData = {
            postId: postId,
            userId: 2, // 임시로 하드코딩
            content: newComment,
        };

        fetch("http://localhost:8080/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentData),
        })
            .then((response) => response.json())
            .then((newComment) => {
                setComments([...comments, newComment]); // 댓글 목록 갱신
                setNewComment(""); // 입력 필드 초기화
            })
            .catch((error) => setError(error.message));
    };

    const handleLikeClick = () => {
        if (liked) {
            // 좋아요 취소
            fetch(`http://localhost:8080/api/posts/${postId}/like?userId=2`, {
                method: "DELETE"
            })
                .then(() => {
                    setLiked(false);
                    setLikeCount((prev) => prev - 1);
                })
                .catch((error) => setError(error.message));
        } else {
            // 좋아요 등록
            fetch(`http://localhost:8080/api/posts/${postId}/like?userId=2`, {
                method: "POST"
            })
                .then(() => {
                    setLiked(true);
                    setLikeCount((prev) => prev + 1);
                })
                .catch((error) => setError(error.message));
        }
    };

    if (error) return <div>에러 발생: {error}</div>;
    if (!post) return <div>로딩 중...</div>;

    return (
        <div className="post-page">
            <Header />
            <div className="post-container">
                {/* Title */}
                <div className="post-title">
                    <h1>{post.title}</h1>
                </div>

                {/* MetaData */}
                <div className="post-meta">
                    <div className="meta-left">
                        {post.nickname}
                    </div>
                    <div className="meta-center">
                        {post.updatedAt && post.updatedAt !== post.createdAt
                            ? `${new Date(post.updatedAt).toLocaleString()} (수정)`
                            : new Date(post.createdAt).toLocaleString()}
                    </div>
                    <div className="meta-right">
                        <span>조회수: {post.viewCount}</span>
                        <span>좋아요: {post.likeCount}</span>
                    </div>

                </div>

                {/* Content */}
                <div className="post-content">
                    <p>{post.content}</p>
                </div>

                <button
                    className={`like-button ${liked ? "liked" : ""}`}
                    onClick={handleLikeClick}
                >
                    {liked ? "좋아요 취소" : "좋아요"} ({likeCount})
                </button>

                {/* Comments Section */}
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
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.commentId} className="comment-item">
                                <div className="comment-header">
                                    <span className="comment-nickname">
                                        {comment.nickname}
                                    </span>
                                    <span className="comment-time">
                                        {comment.updatedAt &&
                                        comment.updatedAt !== comment.createdAt
                                            ? `${new Date(
                                                comment.updatedAt
                                            ).toLocaleString()} (수정)`
                                            : new Date(
                                                comment.createdAt
                                            ).toLocaleString()}
                                    </span>
                                </div>
                                <div className="comment-content">
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>댓글이 없습니다.</p>
                    )}
                </div>

                <div className="button-section">
                    <button
                        /*className="action-button"
                        onClick={() => (window.location.href = "http://localhost:3030/post")}*/>
                        목록
                    </button>
                    <button className="action-button" onClick={handleWriteClick}>
                        글쓰기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Post;

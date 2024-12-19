import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { Button, TextField, Box, Typography, Divider, IconButton } from '@mui/material';
import { ThumbUp, ThumbDown, Edit, Delete } from '@mui/icons-material';
import { blue, red } from '@mui/material/colors';

function Post() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userId, setUserId] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const navigate = useNavigate();

    // 사용자 세션 정보 가져오기
    const fetchSessionUser = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/status', {
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

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    fetch(`/api/posts/${postId}`).then((res) => res.json()),
                    fetch(`/api/post/${postId}/comments`, { credentials: 'include' }).then((res) => res.json()),
                ]);
                setPost(postRes);
                setLikeCount(postRes.likeCount);
                setComments(commentsRes);
                if (userId) {
                    const likeStatusRes = await fetch(
                        `/api/posts/${postId}/like/status?userId=${userId}`,
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
        fetch(`/api/posts/${postId}/like?userId=${userId}`, { method, credentials: 'include' })
            .then(() => {
                setLiked((prev) => !prev);
                setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
            })
            .catch((error) => console.error(error));
    };

    // 댓글 작성
    const handleCommentSubmit = () => {
        if (!newComment.trim()) return;
        if (!userId) {
            alert('로그인이 필요합니다.');
            return;
        }
        const commentData = { postId, content: newComment, userId };
        fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(commentData),
        })
            .then((response) => response.json())
            .then((newComment) => {
                setComments([...comments, newComment]);
                setNewComment('');
            })
            .catch((error) => console.error('Failed to add comment:', error));
    };

    // 댓글 삭제
    const handleDeleteComment = (commentId) => {
        if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;
        fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    setComments((prev) => prev.filter((comment) => comment.commentId !== commentId));
                }
            })
            .catch((error) => console.error('Error deleting comment:', error));
    };

    // 댓글 수정
    const handleEditComment = (comment) => {
        setEditCommentId(comment.commentId);
        setEditContent(comment.content);
    };

    // 댓글 수정 제출
    const handleEditSubmit = (commentId) => {
        if (!editContent.trim()) return;
        fetch(`/api/comments/${commentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content: editContent }),
        })
            .then((response) => response.json())
            .then((updatedComment) => {
                setComments((prev) =>
                    prev.map((comment) => (comment.commentId === commentId ? updatedComment : comment))
                );
                setEditCommentId(null);
                setEditContent('');
            })
            .catch((error) => console.error('Error updating comment:', error));
    };

    // 게시글 수정
    const handleEditPost = () => {
        navigate('/create-post', {
            state: { postId, title: post.title, content: post.content, header: post.header },
        });
    };

    // 게시글 삭제
    const handleDeletePost = () => {
        if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
        fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/board');
                }
            })
            .catch((error) => console.error('Error deleting post:', error));
    };

    if (!post) return <div>로딩 중...</div>;

    return (
        <div className="post-page" style={{ marginTop: '100px' }}>
            <Header />
            <div className="post-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                {userId === post.userId && (
                    <Box display="flex" justifyContent="flex-start" gap={2} marginBottom={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Edit />}
                            onClick={handleEditPost}
                        >
                            수정
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Delete />}
                            onClick={handleDeletePost}
                        >
                            삭제
                        </Button>
                    </Box>
                )}

                <Typography variant="h4" gutterBottom>
                    {post.title}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Typography variant="body2">{post.nickname}</Typography>
                    <Typography variant="body2" color="textSecondary" textAlign="center">
                        {post.updatedAt && post.updatedAt !== post.createdAt
                            ? `${new Date(post.updatedAt).toLocaleString()} (수정)`
                            : new Date(post.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        조회수: {post.viewCount} | 좋아요: {likeCount}
                    </Typography>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                <Typography variant="body1" paragraph>
                    {post.content}
                </Typography>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLikeClick}
                    startIcon={liked ? <ThumbDown /> : <ThumbUp />}
                    sx={{ marginBottom: 2 }}
                >
                    {liked ? '좋아요 취소' : '좋아요'} ({likeCount})
                </Button>

                <Divider sx={{ marginY: 2 }} />

                <div className="comments-section">
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

                    {comments.map((comment) => (
                        <div key={comment.commentId} className="comment-item">
                            <Box display="flex" justifyContent="space-between" marginBottom={1}>
                                <Typography variant="body2">{comment.nickname}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </Typography>
                            </Box>

                            {editCommentId === comment.commentId ? (
                                <Box display="flex" gap={2} flexDirection="column">
                                    <TextField
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        multiline
                                        fullWidth
                                        rows={2}
                                    />
                                    <Box display="flex" gap={2}>
                                        <Button
                                            onClick={() => handleEditSubmit(comment.commentId)}
                                            variant="contained"
                                            color="primary"
                                        >
                                            저장
                                        </Button>
                                        <Button
                                            onClick={() => setEditCommentId(null)}
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            취소
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <div className="comment-content">
                                    <Typography variant="body2">{comment.content}</Typography>
                                    {userId === comment.userId && (
                                        <Box display="flex" gap={2} marginTop={1}>
                                            <Button
                                                onClick={() => handleEditComment(comment)}
                                                startIcon={<Edit />}
                                                variant="outlined"
                                                color="primary"
                                            >
                                                수정
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteComment(comment.commentId)}
                                                startIcon={<Delete />}
                                                variant="outlined"
                                                color="secondary"
                                            >
                                                삭제
                                            </Button>
                                        </Box>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <Box display="flex" gap={2} justifyContent="flex-end" marginTop={3}>
                    <Button onClick={() => navigate('/board')} variant="outlined" color="default">
                        목록
                    </Button>
                    <Button onClick={() => navigate('/create-post')} variant="contained" color="primary">
                        글쓰기
                    </Button>
                </Box>
            </div>
        </div>
    );
}

export default Post;

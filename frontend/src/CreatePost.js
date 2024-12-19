import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper } from '@mui/material';
import Header from './Header';

const CreatePost = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State variables for post creation
    const { state } = location || {};
    const [postId, setPostId] = useState(state?.postId || null);
    const [title, setTitle] = useState(state?.title || '');
    const [content, setContent] = useState(state?.content || '');
    const [header, setHeader] = useState(state?.header || 'TIP'); // Default category
    const [userId, setUserId] = useState(null);

    const [loading, setLoading] = useState(false);

    const categories = [
        { label: '여행 TIP', value: 'TIP' }
    ];

    // Fetch user session status
    const fetchSessionUser = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/status', { credentials: 'include' });
            const data = await response.json();

            if (data.status === 'LoggedIn') {
                setUserId(data.userId);
            } else {
                alert('로그인이 필요합니다.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Failed to fetch session user:', error);
        }
    }, [navigate]);

    useEffect(() => {
        fetchSessionUser();
    }, [fetchSessionUser]);

    // Handle submit (POST or PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert('로그인이 필요합니다.');
            return;
        }

        const postData = { title, content, header, userId };

        try {
            setLoading(true);
            let url = '/api/posts';
            let method = 'POST';

            if (postId) {
                // Update post if in edit mode
                url = `/api/posts/${postId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                const result = await response.json();
                const newPostId = result.postId;
                alert(postId ? '게시글이 수정되었습니다!' : '게시글이 작성되었습니다!');
                navigate(`/post/${newPostId}`);
            } else {
                const errorMessage = await response.text();
                console.error('Error submitting post:', errorMessage);
                alert('게시글 저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Failed to submit post:', error);
            alert('게시글 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '100px', maxWidth: '1000px', margin: '0 auto' }}>
            <Header /> {/* Header included */}

            <Paper sx={{ padding: '30px', borderRadius: '8px', boxShadow: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                    <Typography variant="h4">{postId ? '게시글 수정' : '게시글 작성'}</Typography>

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {/* Title Input */}
                        <TextField
                            label="제목"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontSize: '1rem', // 라벨 크기 조정
                                },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px', // 라운드 모서리 적용
                                    height: '50px', // 입력창 전체 높이 설정
                                },
                                '& .MuiOutlinedInput-input': {
                                    fontSize: '1rem', // 입력 텍스트 크기 조정
                                    padding: '24px', // 내부 여백 조정 (높이를 맞추기 위해)
                                    marginTop: '15px',
                                    borderRadius: '8px'
                                },
                            }}
                        />


                        {/* Category Selection */}
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>카테고리</InputLabel>
                            <Select
                                value={header}
                                onChange={(e) => setHeader(e.target.value)}
                                label="카테고리"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.value} value={category.value}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Content TextArea */}
                        <TextField
                            label="내용"
                            variant="outlined"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                            multiline
                            rows={5}
                        />

                        {/* Submit Button */}
                        <Box display="flex" justifyContent="center" marginTop={2}>
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Button variant="contained" color="primary" type="submit">
                                    {postId ? '수정 완료' : '글 등록하기'}
                                </Button>
                            )}
                        </Box>
                    </form>
                </Box>
            </Paper>
        </div>
    );
};

export default CreatePost;

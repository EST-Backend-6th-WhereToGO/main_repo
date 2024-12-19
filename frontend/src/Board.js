import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Grid, Pagination, Box, CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { blue } from '@mui/material/colors';

const Board = () => {
    const categories = [
        { label: '전체 게시글', value: null },
        { label: '여행 TIP', value: 'TIP' },
        { label: '여행 일정 공유', value: 'TRIP' },
    ];

    const [activeCategory, setActiveCategory] = useState({ label: '전체 게시글', value: null });
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeSort, setActiveSort] = useState('default');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async (url, params = {}) => {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const fullUrl = `${url}?${queryParams}`;

            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();

            setPosts(data.content || []);
            setTotalPages(data.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = { page: 1, size: 5 }; // 한 페이지에 5개 게시글
        fetchPosts('http://localhost:8080/api/posts', params);
    }, []);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);

        const params = { page: 1, size: 5 }; // 한 페이지에 5개 게시글
        let url = '';

        if (category.value) {
            url = 'http://localhost:8080/api/posts/by-header';
            params.header = category.value;
            if (activeSort !== 'default') {
                params.sort = activeSort;
            }
        } else {
            if (activeSort === 'views') {
                url = 'http://localhost:8080/api/posts/by-views';
            } else if (activeSort === 'likes') {
                url = 'http://localhost:8080/api/posts/by-likes';
            } else {
                url = 'http://localhost:8080/api/posts';
            }
        }

        fetchPosts(url, params);
    };

    const handleSortChange = (event) => {
        const sortType = event.target.value;
        setActiveSort(sortType);
        setCurrentPage(1);

        const params = { page: 1, size: 5 }; // 한 페이지에 5개 게시글
        let url = '';

        if (activeCategory.value) {
            url = 'http://localhost:8080/api/posts/by-header';
            params.header = activeCategory.value;
            params.sort = sortType;
        } else {
            if (sortType === 'views') {
                url = 'http://localhost:8080/api/posts/by-views';
            } else if (sortType === 'likes') {
                url = 'http://localhost:8080/api/posts/by-likes';
            } else {
                url = 'http://localhost:8080/api/posts';
            }
        }

        fetchPosts(url, params);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);

        const params = { page, size: 5 }; // 한 페이지에 5개 게시글
        let url = '';

        if (activeCategory.value) {
            url = 'http://localhost:8080/api/posts/by-header';
            params.header = activeCategory.value;
            if (activeSort !== 'default') {
                params.sort = activeSort;
            }
        } else {
            if (activeSort === 'views') {
                url = 'http://localhost:8080/api/posts/by-views';
            } else if (activeSort === 'likes') {
                url = 'http://localhost:8080/api/posts/by-likes';
            } else {
                url = 'http://localhost:8080/api/posts';
            }
        }

        fetchPosts(url, params);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <Header />

            {/* 네비게이션 */}
            <Box display="flex" justifyContent="center" marginBottom={4}>
                {categories.map((category) => (
                    <Button
                        key={category.value || 'all'}
                        variant="contained"
                        color={activeCategory.label === category.label ? 'primary' : 'default'}
                        onClick={() => handleCategoryChange(category)}
                        sx={{ margin: '0 5px' }}
                    >
                        {category.label}
                    </Button>
                ))}
            </Box>

            {/* 카테고리 제목 */}
            <Typography variant="h5" textAlign="center" marginBottom={2}>
                {activeCategory.label}
            </Typography>

            {/* 정렬 드롭다운 */}
            <Box display="flex" justifyContent="center" marginBottom={4}>
                <FormControl variant="outlined">
                    <InputLabel>정렬</InputLabel>
                    <Select
                        value={activeSort}
                        onChange={handleSortChange}
                        label="정렬"
                        sx={{ width: '200px' }}
                    >
                        <MenuItem value="default">최신순</MenuItem>
                        <MenuItem value="views">조회수 순</MenuItem>
                        <MenuItem value="likes">좋아요 순</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* 글쓰기 버튼 */}
            <Box display="flex" justifyContent="flex-end" marginBottom={4}>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ margin: '0 5px' }}
                    onClick={() => navigate('/create-post')}
                >
                    글쓰기
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress size={50} />
                    <Typography variant="h6" sx={{ marginLeft: 2 }}>로딩 중...</Typography>
                </Box>
            ) : (
                <Box>
                    <Grid container spacing={2}>
                        {posts.map((post) => (
                            <Grid item xs={12} key={post.postId}>
                                <Card sx={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${post.postId}`)}>
                                    <CardContent>
                                        <Typography variant="h6" component="div" noWrap>
                                            {post.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" noWrap>{post.content}</Typography>
                                        <Typography variant="body2" color="textSecondary" marginTop={1}>
                                            조회수: {post.viewCount} | 좋아요: {post.likeCount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Box display="flex" justifyContent="center" marginTop={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => handlePageChange(page)}
                    color="primary"
                    shape="rounded"
                />
            </Box>
        </div>
    );
};

export default Board;

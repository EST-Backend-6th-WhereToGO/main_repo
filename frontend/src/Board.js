import React, { useEffect, useState } from 'react';
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

const Board = () => {
    // 사용자 친화적인 이름과 Enum 값 매핑
    const categories = [
        { label: '여행 TIP', value: 'TIP' },
        { label: '여행 일정 공유', value: 'TRIP' },
    ];

    const [activeCategory, setActiveCategory] = useState(categories[0]); // 전체글 기본 선택
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const fetchPosts = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data.content || data); // `content`가 있는 경우와 없는 경우 모두 처리
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        }
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        if (!category.value) {
            // 전체글
            fetchPosts('http://localhost:8080/api/posts');
        } else {
            // 특정 카테고리
            fetchPosts(`http://localhost:8080/api/posts/by-header?header=${category.value}`);
        }
    };

    const handleSortChange = (sortType) => {
        let url = '';
        if (sortType === 'views') {
            url = 'http://localhost:8080/api/posts/by-views';
        } else if (sortType === 'likes') {
            url = 'http://localhost:8080/api/posts/by-likes';
        }
        fetchPosts(url);
    };

    useEffect(() => {
        fetchPosts('http://localhost:8080/api/posts');
    }, []);

    return (
        <div style={styles.container}>
            <Header />

            {/* 네비게이션 */}
            <nav style={styles.nav}>
                {categories.map((category) => (
                    <button
                        key={category.value || 'all'} // null 값 대비 'all'로 키 설정
                        style={{
                            ...styles.button,
                            backgroundColor: activeCategory.label === category.label ? '#007bff' : '#e0e0e0',
                            color: activeCategory.label === category.label ? '#fff' : '#000',
                        }}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {category.label}
                    </button>
                ))}
            </nav>

            {/* 정렬 버튼 */}
            <div style={styles.sortButtonContainer}>
                <button
                    style={styles.sortButton}
                    onClick={() => handleSortChange('views')}
                >
                    조회수 순
                </button>
                <button
                    style={styles.sortButton}
                    onClick={() => handleSortChange('likes')}
                >
                    좋아요 순
                </button>
            </div>

            {/* 글쓰기 버튼 */}
            <div style={styles.writeButtonContainer}>
                <button
                    style={styles.writeButton}
                    onClick={() => navigate('/create-post')}
                >
                    글쓰기
                </button>
            </div>

            {/* 게시글 목록 */}
            <div style={styles.postsContainer}>
                <h2>{activeCategory.label}</h2>
                {posts.length > 0 ? (
                    <ul style={styles.postList}>
                        {posts.map((post) => (
                            <li key={post.id} style={styles.postItem}>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <small>조회수: {post.viewCount} | 좋아요: {post.likeCount}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>해당 카테고리에 게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

// 간단한 스타일 객체
const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' },
    nav: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
    button: {
        padding: '10px 20px',
        margin: '0 5px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    sortButtonContainer: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
    sortButton: {
        padding: '10px 20px',
        margin: '0 5px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        backgroundColor: '#ffc107',
        color: '#000',
    },
    writeButtonContainer: { textAlign: 'right', marginBottom: '20px' },
    writeButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        backgroundColor: '#28a745',
        color: '#fff',
    },
    postsContainer: { textAlign: 'left' },
    postList: { listStyle: 'none', padding: 0 },
    postItem: { borderBottom: '1px solid #ddd', padding: '10px 0' },
};

export default Board;

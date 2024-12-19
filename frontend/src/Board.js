import React, { useEffect, useState } from 'react';
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

const Board = () => {
    // 사용자 친화적인 이름과 Enum 값 매핑
    const categories = [
        { label: '여행 TIP', value: 'TIP' },
        { label: '여행 일정 공유', value: 'TRIP' },
    ];

    const [activeCategory, setActiveCategory] = useState({ label: '전체 게시글', value: null }); // 전체글 기본 선택
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeSort, setActiveSort] = useState('default'); // 정렬 상태 ('default', 'views', 'likes')

    const fetchPosts = async (url, params = {}) => {
        try {
            // URLSearchParams를 사용하여 파라미터를 동적으로 추가
            const queryParams = new URLSearchParams(params).toString();
            const fullUrl = `${url}?${queryParams}`;

            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();

            setPosts(data.content || []); // 게시글 목록
            setTotalPages(data.totalPages || 1); // 전체 페이지 수 설정
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        }
    };

    useEffect(() => {
        const params = { page: 1 };
        fetchPosts('http://localhost:8080/api/posts', params);
    }, []);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);

        const params = { page: 1 };
        let url = '';

        if (category.value) {
            // 특정 카테고리 선택 시
            url = 'http://localhost:8080/api/posts/by-header';
            params.header = category.value; // 카테고리 필터 추가
            if (activeSort !== 'default') {
                params.sort = activeSort; // 정렬 상태 유지
            }
        } else {
            // 전체 게시물 보기일 경우
            if (activeSort === 'views') {
                url = 'http://localhost:8080/api/posts/by-views';
            } else if (activeSort === 'likes') {
                url = 'http://localhost:8080/api/posts/by-likes';
            } else {
                url = 'http://localhost:8080/api/posts';
            }
        }

        // API 호출
        fetchPosts(url, params);
    };

    const handleSortChange = (sortType) => {
        setActiveSort(sortType); // 현재 정렬 기준 업데이트
        setCurrentPage(1); // 정렬 변경 시 첫 페이지로 초기화

        const params = { page: 1 }; // 페이지 초기화
        let url = '';

        if (activeCategory.value) {
            // 특정 카테고리(TIP, TRIP)가 선택된 경우
            url = 'http://localhost:8080/api/posts/by-header';
            params.header = activeCategory.value; // 카테고리 필터 추가
            params.sort = sortType; // 정렬 기준 추가
        } else {
            // 전체 게시물 보기일 경우
            if (sortType === 'views') {
                url = 'http://localhost:8080/api/posts/by-views';
            } else if (sortType === 'likes') {
                url = 'http://localhost:8080/api/posts/by-likes';
            } else {
                url = 'http://localhost:8080/api/posts';
            }
        }

        // API 호출
        fetchPosts(url, params);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);

        const params = { page }; // 현재 페이지 번호 설정
        let url = '';

        if (activeCategory.value) {
            // 특정 카테고리 선택 시
            url = 'http://localhost:8080/api/posts/by-header';
            params.header = activeCategory.value;
            if (activeSort !== 'default') {
                params.sort = activeSort; // 정렬 상태 유지
            }
        } else {
            // 전체 게시물 보기 시
            if (activeSort === 'views') {
                url = 'http://localhost:8080/api/posts/by-views';
            } else if (activeSort === 'likes') {
                url = 'http://localhost:8080/api/posts/by-likes';
            } else {
                url = 'http://localhost:8080/api/posts';
            }
        }

        // API 호출
        fetchPosts(url, params);
    };

    return (
        <div style={styles.container}>
            <Header/>

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
                <button
                    style={{...styles.writeButton, backgroundColor: '#17a2b8'}}
                    onClick={() => {
                        setActiveCategory({label: '전체 게시글', value: null}); // 카테고리 초기화
                        setActiveSort('default');
                        setCurrentPage(1);
                        fetchPosts('http://localhost:8080/api/posts', {page: 1}); // 전체 조회 요청
                    }}
                >
                    전체 게시글 보기
                </button>
            </div>

            {/* 게시글 목록 */}
            <div style={styles.postsContainer}>
                <h2>{activeCategory.label}</h2>
                {posts.length > 0 ? (
                    <ul style={styles.postList}>
                        {posts.map((post) => (
                            <li
                                key={post.postId}
                                style={styles.postItem}
                                onClick={() => navigate(`/post/${post.postId}`)} // 클릭 시 상세 페이지로 이동
                            >
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
            <div style={styles.paginationContainer}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={styles.pageButton}
                >
                    이전
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            ...styles.pageButton,
                            backgroundColor: currentPage === index + 1 ? '#007bff' : '#e0e0e0',
                            color: currentPage === index + 1 ? '#fff' : '#000',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={styles.pageButton}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

// 간단한 스타일 객체
const styles = {
    container: {maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center'},
    nav: {display: 'flex', justifyContent: 'center', marginBottom: '20px'},
    button: {
        padding: '10px 20px',
        margin: '0 5px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    sortButtonContainer: {display: 'flex', justifyContent: 'center', marginBottom: '20px'},
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
    writeButtonContainer: {textAlign: 'right', marginBottom: '20px'},
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
    paginationContainer: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
    pageButton: {
        padding: '8px 12px',
        margin: '0 5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default Board;

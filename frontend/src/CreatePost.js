import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "./Header";

const CreatePost = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 전달된 게시글 데이터 확인 (수정 모드 여부 판단)
    const { state } = location || {};
    const [postId, setPostId] = useState(state?.postId || null);
    const [title, setTitle] = useState(state?.title || '');
    const [content, setContent] = useState(state?.content || '');
    const [header, setHeader] = useState(state?.header || 'TIP'); // 기본값
    const [userId, setUserId] = useState(null);

    const categories = [
        { label: '여행 TIP', value: 'TIP' },
        { label: '여행 일정 공유', value: 'TRIP' },
    ];

    // 사용자 세션 가져오기
    const fetchSessionUser = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/status', {
                credentials: 'include',
            });
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

    // 게시글 제출 (POST 또는 PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert('로그인이 필요합니다.');
            return;
        }

        const postData = { title, content, header, userId };

        try {
            let url = 'http://localhost:8080/api/posts';
            let method = 'POST';

            if (postId) {
                // 수정 모드인 경우 PUT 요청
                url = `http://localhost:8080/api/posts/${postId}`;
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
        }
    };

    return (
        <div style={styles.container}>
            <Header/>
            <h2>{postId ? '게시글 수정' : '게시글 작성'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>카테고리</label>
                    <select
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                        style={styles.select}
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={styles.textarea}
                        rows="5"
                        required
                    />
                </div>

                <button type="submit" style={styles.submitButton}>
                    {postId ? '수정 완료' : '글 등록하기'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    formGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
    label: { fontWeight: 'bold', marginBottom: '5px' },
    input: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' },
    select: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' },
    textarea: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', resize: 'none'},
    submitButton: {
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
};

export default CreatePost;

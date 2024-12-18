import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [header, setHeader] = useState('TIP'); // 기본 카테고리 Enum 값
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    // 사용자 친화적인 이름과 Enum 값 매핑
    const categories = [
        { label: '여행 TIP', value: 'TIP' },
        { label: '여행 일정 공유', value: 'TRIP' },
    ];

    // 세션 사용자 ID 가져오기
    const fetchSessionUser = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/status', {
                credentials: 'include', // 세션 쿠키 포함
            });
            const data = await response.json();

            if (data.status === 'LoggedIn') {
                setUserId(data.userId); // 사용자 ID 설정
            } else {
                alert('로그인이 필요합니다.');
                navigate('/login'); // 로그인 페이지로 이동
            }
        } catch (error) {
            console.error('Failed to fetch session user:', error);
            alert('세션 정보를 불러오는데 실패했습니다.');
        }
    }, [navigate]); // navigate를 종속성 배열에 추가

    // 컴포넌트 로드 시 사용자 정보 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchSessionUser();
                console.log('Session user fetched successfully');
            } catch (error) {
                console.error('Error fetching session user:', error);
            }
        };
        fetchData();
    }, [fetchSessionUser]);

    // 게시글 제출
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userId) {
            alert('로그인이 필요합니다.');
            return;
        }

        // 데이터 서버로 전송
        fetch('http://localhost:8080/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'userId': userId, // 세션 사용자 ID 추가
            },
            body: JSON.stringify({ title, content, header }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('게시글이 성공적으로 작성되었습니다!');
                    navigate('/board'); // 게시판 페이지로 이동
                } else {
                    alert('게시글 작성 중 오류가 발생했습니다.');
                }
            })
            .catch((error) => {
                console.error('게시글 작성 실패:', error);
                alert('게시글 작성 중 오류가 발생했습니다.');
            });
    };

    return (
        <div style={styles.container}>
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* 제목 입력 */}
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

                {/* 카테고리 선택 */}
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

                {/* 내용 입력 */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={styles.textarea}
                        rows="5"
                        required
                    ></textarea>
                </div>

                {/* 제출 버튼 */}
                <button type="submit" style={styles.submitButton}>
                    글 등록하기
                </button>
            </form>
        </div>
    );
};

// 스타일 객체
const styles = {
    container: { maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    formGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
    label: { fontWeight: 'bold', marginBottom: '5px' },
    input: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' },
    select: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' },
    textarea: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' },
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

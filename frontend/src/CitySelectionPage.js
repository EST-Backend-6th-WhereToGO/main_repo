import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL 파라미터를 가져오기 위한 훅

function CitySelectionPage() {
    const { categoryId } = useParams(); // URL에서 categoryId 가져오기
    const [cities, setCities] = useState([]); // 도시 목록 상태
    const [selectedCity, setSelectedCity] = useState(''); // 선택된 도시 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        if (!categoryId) {
            setError('카테고리 ID가 필요합니다.');
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/api/cities/${categoryId}`) // 서버의 절대 경로
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`데이터를 가져오는데 실패했습니다: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setCities(data); // 도시 목록 업데이트
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [categoryId]);

    const handleCitySelection = (event) => {
        setSelectedCity(event.target.value);
    };

    const handleConfirm = () => {
        if (selectedCity) {
            alert(`선택된 도시: ${selectedCity}`);
        } else {
            alert('도시를 선택해주세요!');
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;

    return (
        <div>
            <h1>도시 선택</h1>
            <ul>
                {cities.map((city, index) => (
                    <li key={index}>
                        <label>
                            <input
                                type="radio"
                                name="city"
                                value={city.cityName}
                                onChange={handleCitySelection}
                            />
                            {city.cityName}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleConfirm}>확인</button>
        </div>
    );
}

export default CitySelectionPage;

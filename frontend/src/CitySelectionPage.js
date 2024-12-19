import React, { useState, useEffect } from 'react';
import './CitySelectionPage.css';

function CitySelectionPage({ categoryId, onClose, onCitySelect }) {
    const [cities, setCities] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCity, setSelectedCity] = useState(null); // city 객체로 선택
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 9;

    useEffect(() => {
        if (!categoryId) {
            setError('카테고리 ID가 필요합니다.');
            setLoading(false);
            return;
        }

        fetch(`/api/cities/${categoryId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`데이터를 가져오는데 실패했습니다: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched cities:', data); // cityId와 cityName 확인
                setCities(data); // 데이터를 상태에 저장
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [categoryId]);


    const handleCitySelection = (city) => {
        console.log('Selected city:', city); // 도시 객체 전체 출력
        console.log('City ID:', city.cityId, 'City Name:', city.cityName); // 명시적으로 출력
        setSelectedCity(city); // 도시 객체 선택
    };


    const handleConfirm = () => {
        if (selectedCity) {
            onCitySelect(selectedCity); // 도시 객체 전달
        } else {
            alert('도시를 선택해주세요!');
        }
    };

    const totalPages = Math.ceil(cities.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const getPaginatedCities = () => {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        return cities.slice(start, end);
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;

    return (
        <div className="city-selection-container">
            <h1>도시 선택</h1>

            <div className="pagination-buttons">
                <button onClick={handlePrevPage} disabled={currentPage === 0}>
                    이전
                </button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages - 1 || totalPages === 0}>
                    다음
                </button>
            </div>

            <div className="grid-container">
                {getPaginatedCities().map((city, index) => (
                    <div
                        key={index}
                        className={`grid-item ${selectedCity?.cityId === city.cityId ? 'selected' : ''}`}
                        onClick={() => handleCitySelection(city)} // 도시 객체 선택
                    >
                        {city.cityName}
                    </div>
                ))}
            </div>

            <div className="button-group">
                <button onClick={handleConfirm}>확인</button>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}

export default CitySelectionPage;

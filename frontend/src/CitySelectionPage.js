import React, { useEffect, useState } from 'react';
import { Grid, Button, CircularProgress, Box, Typography } from '@mui/material';
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
                setCities(data); // 데이터를 상태에 저장
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [categoryId]);

    const handleCitySelection = (city) => {
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

    if (loading) return <CircularProgress />; // Material UI의 로딩 컴포넌트
    if (error) return <p>에러 발생: {error}</p>;

    return (
        <Box className="city-selection-container" sx={{ padding: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                도시 선택
            </Typography>

            {/* Pagination Buttons */}
            <Box display="flex" justifyContent="center" marginBottom={2}>
                <Button onClick={handlePrevPage} disabled={currentPage === 0}>
                    이전
                </Button>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1 || totalPages === 0}>
                    다음
                </Button>
            </Box>

            {/* 3x3 Grid of cities */}
            <Grid container spacing={2} justifyContent="center">
                {getPaginatedCities().map((city) => (
                    <Grid item xs={4} key={city.cityId}>
                        <Button
                            variant="outlined"
                            fullWidth
                            className={selectedCity?.cityId === city.cityId ? 'selected' : ''} // selected class
                            onClick={() => handleCitySelection(city)}
                        >
                            {city.cityName}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="center" gap={2} marginTop={3}>
                <Button variant="contained" color="primary" onClick={handleConfirm}>
                    확인
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    닫기
                </Button>
            </Box>
        </Box>
    );
}

export default CitySelectionPage;

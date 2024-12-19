import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import DateRangePicker from './DateRangePicker';
import SearchPage from './SearchPage';
import CitySelectionPage from './CitySelectionPage';
import Header from './Header';
import './Home.css';

function Home() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [exchangeRates, setExchangeRates] = useState([]);
    const [currentRateIndex, setCurrentRateIndex] = useState(0);
    const [currentRate, setCurrentRate] = useState(null);
    const [weatherData, setWeatherData] = useState([]);
    const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 추가

    // 세션에서 userId 가져오기
    const fetchSessionUser = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/status", {
                credentials: "include",
            });
            const data = await response.json();

            if (data.status === "LoggedIn") {
                setUserId(data.userId);
            } else {
                setUserId(null);
                setError("로그인이 필요합니다.");
            }
        } catch (error) {
            console.error("Failed to fetch session user:", error);
            setError("세션 정보를 불러오는 데 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchSessionUser();
    }, []);

    // 검색 버튼 클릭 시 팝업 모달 열기
    const handleSearchClick = () => {
        if (!selectedCategory || !startDate || !endDate) {
            alert('카테고리와 날짜를 모두 선택해주세요.');
            return;
        }
        setShowCityModal(true);
    };

    const closeCityModal = () => {
        setShowCityModal(false);
    };

    const handleCitySelection = (city) => {
        setSelectedCity(city);
        setShowCityModal(false);

        // TripPlanner로 이동하면서 필요한 state를 전달
        navigate('/tripplan', {
            state: {
                startDate,
                endDate,
                selectedCity: city,
                selectedCategory,
                userId,
            },
        });
    };

    // 카테고리 데이터 가져오기
    useEffect(() => {
        fetch('/api/categories/categories')
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    // 환율 데이터 가져오기
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch('/api/exchange-rates');
                if (response.ok) {
                    const data = await response.json();
                    setExchangeRates(data);
                    setCurrentRate(data[0]);
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (exchangeRates.length > 0) {
                const nextIndex = (currentRateIndex + 1) % exchangeRates.length;
                setCurrentRateIndex(nextIndex);
                setCurrentRate(exchangeRates[nextIndex]);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [exchangeRates, currentRateIndex]);

    // 날씨 데이터 가져오기
    useEffect(() => {
        const fetchWeather = async () => {
            const cachedWeather = localStorage.getItem('weatherData');
            if (cachedWeather) {
                const parsedData = JSON.parse(cachedWeather);
                setWeatherData(parsedData);
                setCurrentWeather(parsedData[0]);
                return;
            }

            if (isLoadingWeather) return;

            setIsLoadingWeather(true);
            try {
                const response = await fetch('/api/weather');
                if (response.ok) {
                    const data = await response.json();
                    setWeatherData(data);
                    setCurrentWeather(data[0]);
                    localStorage.setItem('weatherData', JSON.stringify(data));
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            } finally {
                setIsLoadingWeather(false);
            }
        };

        fetchWeather();
    }, [isLoadingWeather]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (weatherData.length > 0) {
                const nextWeatherIndex = (currentWeatherIndex + 1) % weatherData.length;
                setCurrentWeatherIndex(nextWeatherIndex);
                setCurrentWeather(weatherData[nextWeatherIndex]);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [weatherData, currentWeatherIndex]);

    return (
        <div className="App">
            <Header />

            <>
                <label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            const selectedOption = categories.find(
                                (category) => category.name === e.target.value
                            );
                            setSelectedCategory(e.target.value);
                            setSelectedCategoryId(selectedOption ? selectedOption.id : null);
                        }}
                    >
                        <option value="">카테고리</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="date-picker-container">
                    <DateRangePicker
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                </div>

                <button onClick={handleSearchClick}>검색</button>

                {showCityModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <CitySelectionPage
                                categoryId={selectedCategoryId}
                                onClose={closeCityModal}
                                onCitySelect={handleCitySelection}
                            />
                        </div>
                    </div>
                )}

                <div className="exchange-rate-container">
                    <h2>환율 정보</h2>
                    {currentRate ? (
                        <div>
                            <p>통화: {currentRate.cur_unit}</p>
                            <p>기준 환율: {currentRate.deal_bas_r}</p>
                            <p>통화명: {currentRate.cur_nm}</p>
                        </div>
                    ) : (
                        <p>환율 정보를 불러오는 중...</p>
                    )}
                </div>

                <div>
                    <h2>날씨 정보</h2>
                    {isLoadingWeather ? (
                        <p>Loading weather data...</p>
                    ) : currentWeather ? (
                        <div>
                            <h2>{currentWeather.cityName}</h2>
                            <p>Temperature: {currentWeather.weather.current.temp_c}°C</p>
                            <p>Condition: {currentWeather.weather.current.condition.text}</p>
                            <img src={currentWeather.weather.current.condition.icon} alt="Weather Icon"/>
                        </div>
                    ) : (
                        <p>날씨 정보를 불러오지 못했습니다.</p>
                    )}
                </div>

                <SearchPage/>
            </>
        </div>
    );
}

export default Home;

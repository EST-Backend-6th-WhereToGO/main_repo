import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [userId, setUserId] = useState(null); // 로그인 상태와 유저 정보 추가
    const [loginStatus, setLoginStatus] = useState('Checking...'); // 로그인 상태를 체크하는 상태

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
                setLoginStatus('Logged In');
            } else {
                setUserId(null);
                setLoginStatus('Not Logged In');
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
                    setCurrentRate(data[0]); // 초기 환율 설정
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
            <div className="select-container">
                {/* 첫 번째 묶음: 카테고리, 날짜, 검색 */}
                <div className="first-row-container">
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
                                <option key={category.id} value={category.id}> {/* category.id를 사용 */}
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

                    <button
                        className="search-button"
                        onClick={handleSearchClick}
                        disabled={loginStatus === "Not Logged In"} // 로그인되지 않으면 비활성화
                    >
                        검색
                    </button>
                </div>

                {showCityModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <CitySelectionPage
                                categoryId={selectedCategory}
                                onClose={closeCityModal}
                                onCitySelect={handleCitySelection}
                            />
                        </div>
                    </div>
                )}

                {/* 두 번째 묶음: 환율 정보와 날씨 정보 */}
                <div className="second-row-container">
                    {/* 환율 정보 카드 */}
                    <div className="exchange-rate-container">
                        {currentRate ? (
                            <div>
                                <h2>{currentRate.cur_nm}</h2>
                                <h1>{currentRate.deal_bas_r}</h1>
                                <p>{currentRate.cur_unit}</p>
                            </div>
                        ) : (
                            <p>환율 정보를 불러오는 중...</p>
                        )}
                    </div>

                    {/* 날씨 정보 카드 */}
                    <div className="weather-container">
                        <img
                            src={currentWeather ? currentWeather.weather.current.condition.icon : ''}
                            alt="Weather Icon"
                        />
                        <div className="weather-info">
                            <h2>{currentWeather ? currentWeather.cityName : 'Loading...'}</h2>
                            {currentWeather ? (
                                <div>
                                    <h1>{currentWeather.weather.current.temp_c}°C</h1>
                                </div>
                            ) : (
                                <p>날씨 정보를 불러오지 못했습니다.</p>
                            )}
                        </div>
                    </div>
                </div>

                <SearchPage />
            </div>
        </div>
    );
}

export default Home;

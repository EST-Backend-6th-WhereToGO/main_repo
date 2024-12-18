import React, { useEffect, useState } from 'react';
import DateRangePicker from './DateRangePicker';
import SearchPage from './SearchPage';
import CitySelectionPage from './CitySelectionPage';
import TripPlanner from './TripPlanner';
import Header from './Header';
import './App.css';
import './Home.css';

function Home() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState(null); // 선택된 도시
    const [exchangeRates, setExchangeRates] = useState([]);
    const [currentRateIndex, setCurrentRateIndex] = useState(0);
    const [currentRate, setCurrentRate] = useState(null);
    const [weatherData, setWeatherData] = useState([]);
    const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [showCityModal, setShowCityModal] = useState(false);
    const [showTripPlanner, setShowTripPlanner] = useState(false); // TripPlanner 표시 여부

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
        setShowTripPlanner(true); // TripPlanner 표시
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
            try {
                const response = await fetch('/api/weather');
                if (response.ok) {
                    const data = await response.json();
                    setWeatherData(data);
                    setCurrentWeather(data[0]);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchWeather();
    }, []);

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

            {!showTripPlanner ? (
                <>
                    <label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">카테고리</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
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

                    <div>
                        <button onClick={handleSearchClick}>검색</button>
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
                        {currentWeather ? (
                            <div>
                                <h2>{currentWeather.cityName}</h2>
                                <p>Temperature: {currentWeather.weather.current.temp_c}°C</p>
                                <p>Condition: {currentWeather.weather.current.condition.text}</p>
                                <img src={currentWeather.weather.current.condition.icon} alt="Weather Icon" />
                            </div>
                        ) : (
                            <p>Loading weather data...</p>
                        )}
                    </div>

                    <SearchPage />
                </>
            ) : (
                <TripPlanner
                    startDate={startDate}
                    endDate={endDate}
                    selectedCity={selectedCity}
                />
            )}

            <footer>
                <h3>로그인 상태: 확인은 헤더에서 보세요</h3>
            </footer>
        </div>
    );
}

export default Home;

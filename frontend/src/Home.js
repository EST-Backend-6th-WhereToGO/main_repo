import React, { useEffect, useState } from 'react';
import DateRangePicker from './DateRangePicker';
import SearchPage from './SearchPage';
import './App.css';
import { useNavigate } from "react-router-dom";

function Home() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [categories, setCategories] = useState([]);
    const [exchangeRates, setExchangeRates] = useState([]);
    const [currentRateIndex, setCurrentRateIndex] = useState(0);
    const [currentRate, setCurrentRate] = useState(null);
    const [weatherData, setWeatherData] = useState([]);
    const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [loginStatus, setLoginStatus] = useState("Checking...");
    const navigate = useNavigate();

    // 로그인 버튼 클릭 시 실행되는 함수
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    // 로그인 상태 확인
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch("/api/auth/status", { credentials: "include" });
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === "LoggedIn") {
                        setLoginStatus(`Logged In as ${data.email}`);
                    } else {
                        setLoginStatus("Not Logged In");
                    }
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoginStatus("Error checking login status");
            }
        };
        checkLoginStatus();
    }, []);

    // 로그인 성공 시 사용자 정보 확인 및 라우팅
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("/api/auth/success", {
                    credentials: "include",
                });
                if (response.ok) {
                    const userData = await response.json();
                    console.log("User Info:", userData);

                    // 사용자 존재 여부 확인
                    const checkUserResponse = await fetch(`/api/users/check?email=${userData.email}`);
                    if (checkUserResponse.ok) {
                        const userExists = await checkUserResponse.json();

                        if (userExists) {
                            navigate('/step3');
                        } else {
                            navigate('/step1', {
                                state: {
                                    name: userData.name,
                                    email: userData.email,
                                    sub: userData.sub
                                }
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        if (window.location.href.includes("api/auth/success")) {
            fetchUserInfo();
        }
    }, [navigate]);

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
        const interval = setInterval(fetchWeather, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="App">
            <header className="sticky-header">
                <div className="logo">
                    <img src="/logo.png" alt="Logo" />
                </div>
                <div className="login">
                    <button className="login-button" onClick={handleLogin}>
                        구글 로그인
                    </button>
                </div>
            </header>

            <label>
                <select>
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

            {/* 로그인 상태 출력 */}
            <footer>
                <h3>로그인 상태: {loginStatus}</h3>
            </footer>
        </div>
    );
}

export default Home;

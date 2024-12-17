import React, { useEffect, useState } from 'react';
import DateRangePicker from './DateRangePicker';

import SearchPage from './SearchPage'; // 새로 만든 컴포넌트 추가
import './App.css';
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();

    // 카테고리 데이터 가져오기
    useEffect(() => {
        fetch('/api/categories')
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
                    const filteredData = data.map(({ cur_unit, deal_bas_r, cur_nm }) => ({
                        cur_unit,
                        deal_bas_r,
                        cur_nm,
                    }));
                    setExchangeRates(filteredData);
                    setCurrentRate(filteredData[0]);
                } else {
                    console.error('Failed to fetch exchange rates');
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRate((prevRate) => {
                if (exchangeRates.length === 0) return null;
                const nextIndex = (currentRateIndex + 1) % exchangeRates.length;
                setCurrentRateIndex(nextIndex);
                return exchangeRates[nextIndex];
            });
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
                } else {
                    console.error('Failed to fetch weather data');
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchWeather();
        const interval = setInterval(fetchWeather, 300000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWeather((prevWeather) => {
                if (weatherData.length === 0) return null;
                const nextIndex = (currentWeatherIndex + 1) % weatherData.length;
                setCurrentWeatherIndex(nextIndex);
                return weatherData[nextIndex];
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [weatherData, currentWeatherIndex]);

    return (
        <div className="App">
            <header className="sticky-header">
                <div className="logo">
                    <img src="/logo.png" alt="Logo" />
                </div>
                <div className="login">
                    <button className="login-button">구글 로그인</button>
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
                        {currentWeather.weather?.current ? (
                            <>
                                <p>Temperature: {currentWeather.weather.current.temp_c}°C</p>
                                <p>Condition: {currentWeather.weather.current.condition.text}</p>
                                <img
                                    src={currentWeather.weather.current.condition.icon}
                                    alt="Weather Icon"
                                />
                            </>
                        ) : (
                            <p>날씨 데이터를 불러오는 중...</p>
                        )}
                    </div>
                ) : (
                    <p>Loading weather data...</p>
                )}
            </div>


            <SearchPage/>

            <div className="navigate-container">
                <button onClick={() => navigate('/step1')} className="navigate-button">
                    다른 페이지로 이동
                </button>
            </div>

        </div>
    );
}

export default Home;

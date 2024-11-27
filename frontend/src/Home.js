import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.location.href = googleSearchUrl;
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  const handleNavigate = () => {
    navigate('/step1'); // '/about' 페이지로 이동
  };

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

      <div className="search-container">
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          검색
        </button>
      </div>

      <div className="navigate-container">
        <button onClick={handleNavigate} className="navigate-button">
          다른 페이지로 이동
        </button>
      </div>
    </div>
  );
}

export default Home;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 사용
import './Step2.css'; // 스타일 추가

function Step2({ updateProgress }) {
  const [preferences, setPreferences] = useState([]);
  const options = ['음악', '영화', '운동', '독서', '여행', '게임', '요리', '예술', '패션'];

  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  const handleBoxClick = (option) => {
    if (preferences.includes(option)) {
      setPreferences(preferences.filter((item) => item !== option));
    } else {
      setPreferences([...preferences, option]);
    }
  };

  const handlePrevious = () => {
    updateProgress(0); // 진행 상태를 50%로 업데이트
    navigate('/step1'); // Step1으로 이동
  };

  const handleSubmit = () => {
    if (preferences.length > 0) {
      updateProgress(100); // 진행 상태를 100%로 업데이트
      alert(`선택한 취향: ${preferences.join(', ')}`);
      navigate('/step3'); // 완료 후 홈("/")으로 이동
    } else {
      alert('하나 이상의 취향을 선택해주세요.');
    }
  };

  return (
    <div className="form-container">
      <h2>취향 선택</h2>
      <div className="grid-container">
        {options.map((option) => (
          <div
            key={option}
            className={`grid-item ${preferences.includes(option) ? 'selected' : ''}`}
            onClick={() => handleBoxClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
      <div className="button-group">
        <button onClick={handlePrevious}>이전</button> {/* 이전 버튼 */}
        <button onClick={handleSubmit}>완료</button> {/* 완료 버튼 */}
      </div>
    </div>
  );
}

export default Step2;

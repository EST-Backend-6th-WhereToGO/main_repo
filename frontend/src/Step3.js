import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Step3.css'; // 스타일 파일 추가

function Step3({updateProgress}) {
  const navigate = useNavigate();

  const handleHome = () => {
    updateProgress(0);
    navigate('/'); // 홈("/")으로 이동
  };

  return (
    <div className="step3-container">
      <h2>회원가입이 완료되었습니다!</h2>
      <p>축하합니다! 회원가입이 성공적으로 완료되었습니다. 아래 버튼을 눌러 홈으로 이동하세요.</p>
      <button onClick={handleHome} className="home-button">
        홈으로 가기
      </button>
    </div>
  );
}

export default Step3;

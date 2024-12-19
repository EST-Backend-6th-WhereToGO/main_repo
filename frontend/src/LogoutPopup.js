import React from "react";
import "./LogoutPopup.css";

function LogoutPopup({ onClose }) {
    return (
        <div className="logout-popup-overlay">
            <div className="logout-popup">
                <h2>로그아웃 되었습니다</h2>
                <p>홈 화면으로 이동합니다...</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}

export default LogoutPopup;

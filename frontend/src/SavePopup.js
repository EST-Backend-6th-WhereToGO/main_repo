import React from "react";
import "./SavePopup.css"; // 팝업 스타일

const SavePopup = ({ message, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>알림</h2>
                <p>{message}</p>
                <button className="popup-button" onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
};

export default SavePopup;

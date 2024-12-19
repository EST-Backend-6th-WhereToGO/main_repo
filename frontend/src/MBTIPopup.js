import React from "react";
import "./MBTIPopup.css";

const MBTIPopup = ({ onClose, onSelect }) => {
    const mbtiOptions = [
        "INTJ", "INTP", "ENTJ", "ENTP",
        "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ",
        "ISTP", "ISFP", "ESTP", "ESFP",
    ];

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>MBTI 선택</h2>
                <div className="mbti-grid">
                    {mbtiOptions.map((type) => (
                        <button
                            key={type}
                            className="mbti-button"
                            onClick={() => onSelect(type)} // 선택 시 MBTI 값 반환
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <button className="close-button" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default MBTIPopup;

import React, { useState } from "react";
import "./SharePopup.css"; // 팝업 스타일링 파일
import { Button, Typography, Box, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SharePopup = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>일정을 공유하시겠습니까?</h2>
                <p>공유 여부를 선택하세요.</p>
                <div className="popup-actions">
                    <button onClick={() => onConfirm(true)}>공유</button>
                    <button onClick={() => onConfirm(false)}>공유 안함</button>
                </div>
                <button className="popup-close" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default SharePopup;

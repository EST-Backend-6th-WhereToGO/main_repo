import React from "react";
import { Button, Typography, Box, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./LogoutPopup.css";

function LogoutPopup({ open, onClose }) {
    const navigate = useNavigate();

    const handleClose = () => {
        onClose(); // 팝업 닫기
        navigate('/'); // 홈 화면으로 이동
        window.location.reload(); // 페이지 새로 고침
    };

    return (
        <Modal
            open={open}  // Modal을 여는 상태
            onClose={onClose}  // Modal 닫을 때
            aria-labelledby="logout-popup-title"
            aria-describedby="logout-popup-description"
        >
            <Box className="logout-popup">
                <Typography variant="h6" id="logout-popup-title" gutterBottom>
                    로그아웃 되었습니다
                </Typography>
                <Typography variant="body1" id="logout-popup-description" paragraph>
                    홈 화면으로 이동합니다...
                </Typography>
                <Box className="logout-popup-buttons">
                    <Button variant="contained" color="primary" onClick={handleClose}>
                        닫기
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default LogoutPopup;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutPopup from "./LogoutPopup";
import "./Header.css";

function Header() {
    const [loginStatus, setLoginStatus] = useState("Checking...");
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // 팝업 상태
    const navigate = useNavigate();

    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", { method: "GET", credentials: "include" });
            if (response.ok) {
                setLoginStatus("Not Logged In");
                setShowLogoutPopup(true); // 팝업 표시
                setTimeout(() => {
                    setShowLogoutPopup(false);
                    navigate("/");
                }, 3000); // 3초 후 팝업 닫고 홈으로 이동
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

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

    return (
        <header className="sticky-header">
            <div className="header-left">
                <div className="logo" onClick={() => navigate("/")}>
                    <img src="/logo.png" alt="Logo" />
                </div>
                {loginStatus.startsWith("Logged In") && (
                    <div className="nav-links">
                        <span onClick={() => navigate("/mypage")}>내 정보</span>
                        <span onClick={() => navigate("/board")}>게시판</span>
                    </div>
                )}
            </div>
            <div className="header-right">
                <button className="login-button" onClick={loginStatus === "Not Logged In" ? handleLogin : handleLogout}>
                    {loginStatus === "Not Logged In" ? "구글 로그인" : "로그아웃"}
                </button>
            </div>
            {showLogoutPopup && <LogoutPopup onClose={() => setShowLogoutPopup(false)} />}
        </header>
    );
}

export default Header;

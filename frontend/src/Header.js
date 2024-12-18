import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const [loginStatus, setLoginStatus] = useState("Checking...");
    const navigate = useNavigate();

    // 로그인 버튼 클릭 시 실행되는 함수
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    // 로그인 상태 확인
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
            <div className="logo">
                <img src="/logo.png" alt="Logo" />
            </div>
            <div className="login">
                <button className="login-button" onClick={handleLogin}>
                    구글 로그인
                </button>
            </div>
            {/* 로그인 상태 표시 */}
            <div className="login-status">
                <h4>{loginStatus}</h4>
            </div>
        </header>
    );
}

export default Header;

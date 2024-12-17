import React from 'react';
import './Header.css'; // 스타일 연결

function Header() {
    return (
        <header className="sticky-header">
            <div className="logo">
                <img src="/logo.png" alt="Logo" />
            </div>
            <div className="login">
                <button className="login-button">구글 로그인</button>
            </div>
        </header>
    );
}

export default Header;

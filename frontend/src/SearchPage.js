import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css"

function SearchPage() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/results?query=${encodeURIComponent(query)}`);
        } else {
            alert("검색어를 입력해주세요.");
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        const onlyKorean = value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, "");
        if (value !== onlyKorean) {
            alert("검색어는 한글로만 입력해주세요.");
        }
        setQuery(onlyKorean);
    };

    // 엔터 키 입력시 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div>
            <h1>도시 검색</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="도시 이름을 입력하세요"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}  // 엔터 키 이벤트 추가
                    className="search-input"
                />
                <button className="search-button" onClick={handleSearch}>검색</button>
            </div>
        </div>
    );
}

export default SearchPage;

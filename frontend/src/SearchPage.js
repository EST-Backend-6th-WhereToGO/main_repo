import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    return (
        <div>
            <h1>City or Wikipedia Search</h1>
            <input
                type="text"
                placeholder="도시 이름을 입력하세요"
                value={query}
                onChange={handleChange}
            />
            <button onClick={handleSearch}>검색</button>
        </div>
    );
}

export default SearchPage;

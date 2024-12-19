import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import YouTubeEmbed from "./YouTubeEmbed";

function ResultPage() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [wikipediaData, setWikipediaData] = useState(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = decodeURIComponent(queryParams.get("query"));
    const [blogData, setBlogData] = useState([]);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const cityResponse = await fetch(`/api/cities/search?cityName=${encodeURIComponent(query)}`);
                const cityResult = await cityResponse.json();

                if (cityResult.found) {
                    setCategories(cityResult.categories);
                    setSelectedCategory(cityResult.categories[0]); // 첫 번째 카테고리 선택
                } else {
                    const wikipediaResponse = await fetch(`/api/wikipedia/search?query=${encodeURIComponent(query)}`);
                    const wikipediaResult = await wikipediaResponse.json();
                    setWikipediaData(wikipediaResult);
                }

                const youtubeResponse = await fetch(`/youtube?keyword=${encodeURIComponent(query)}`);
                const youtubeResult = await youtubeResponse.text();
                setYoutubeVideoId(youtubeResult);

                const blogResponse = await fetch(`/search?query=${encodeURIComponent(query)}`);
                const blogResult = await blogResponse.json();
                setBlogData(blogResult);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (query) {
            fetchResult();
        }
    }, [query]);

    const handleCategoryChange = (event) => {
        const selected = categories.find(cat => cat.categoryName === event.target.value);
        setSelectedCategory(selected);
    };

    return (
        <div>
            <h1>검색 결과: "{query}"</h1>

            {categories.length > 0 ? (
                <div>
                    <label htmlFor="categorySelect">카테고리 선택: </label>
                    <select id="categorySelect" onChange={handleCategoryChange}>
                        {categories.map((category, index) => (
                            <option key={index} value={category.categoryName}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>

                    {selectedCategory && (
                        <div>
                            <h2>{selectedCategory.cityDetails.cityName}</h2>
                            <img
                                src={selectedCategory.cityDetails.photo}
                                alt={selectedCategory.cityDetails.cityName}
                                style={{ width: "300px" }}
                            />
                            <p>{selectedCategory.cityDetails.description}</p>
                            {selectedCategory.cityDetails.domestic ? (
                                <>
                                    {selectedCategory.cityDetails.flightTime && <p>비행시간: {selectedCategory.cityDetails.flightTime}시간</p>}
                                    {selectedCategory.cityDetails.visaInfo && <p>비자 정보: {selectedCategory.cityDetails.visaInfo}</p>}
                                    {selectedCategory.cityDetails.timeDiff && <p>시차: {selectedCategory.cityDetails.timeDiff}</p>}
                                </>
                            ) : null}
                            <p>화폐: {selectedCategory.cityDetails.currency}</p>
                            <p>언어: {selectedCategory.cityDetails.language}</p>
                            <p>추천 날씨: {selectedCategory.cityDetails.weather}</p>
                            <p>추천 옷차림: {selectedCategory.cityDetails.clothes}</p>
                            <p>추천 여행 기간: {selectedCategory.cityDetails.period}</p>
                            <p>예상 비용: {selectedCategory.cityDetails.expense}</p>
                        </div>
                    )}
                </div>
            ) : wikipediaData ? (
                <div>
                    <h2>{wikipediaData.title}</h2>
                    {wikipediaData.thumbnail && (
                        <img src={wikipediaData.thumbnail} alt={wikipediaData.title} style={{ width: "200px" }} />
                    )}
                    <p>{wikipediaData.extract}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <div>
                <h1>블로그 추천</h1>
                {blogData.length > 0 ? (
                    <ul>
                        {blogData.map((blog, index) => (
                            <li key={index}>
                                <a href={blog.link} target="_blank" rel="noopener noreferrer">
                                    {blog.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>블로그 데이터를 불러오는 중...</p>
                )}
            </div>

            <div>
                <h1>유튜브 영상</h1>
                {youtubeVideoId ? <YouTubeEmbed videoId={youtubeVideoId} /> : <p>유튜브 영상을 불러오는 중...</p>}
            </div>
        </div>
    );
}

export default ResultPage;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import YouTubeEmbed from "./YouTubeEmbed";

function ResultPage() {
    const [cityData, setCityData] = useState(null);
    const [wikipediaData, setWikipediaData] = useState(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState(null); // 유튜브 videoId 상태 추가
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = decodeURIComponent(queryParams.get("query"));

    useEffect(() => {
        const fetchResult = async () => {
            try {
                // 도시 데이터 불러오기
                const cityResponse = await fetch(`/api/cities?cityName=${encodeURIComponent(query)}`);
                const cityResult = await cityResponse.json();

                if (cityResult.found) {
                    setCityData(cityResult.data);
                } else {
                    const wikipediaResponse = await fetch(`/api/wikipedia/search?query=${encodeURIComponent(query)}`);
                    const wikipediaResult = await wikipediaResponse.json();
                    setWikipediaData(wikipediaResult);
                }

                // 유튜브 API 호출
                const youtubeResponse = await fetch(`/youtube?keyword=${encodeURIComponent(query)}`);
                const youtubeResult = await youtubeResponse.text(); // 문자열 값 반환
                console.log("Youtube API Result:", youtubeResult);

                // 유튜브 검색 결과를 파싱하여 videoId 추출
                // youtubeResult가 JSON으로 반환되면 JSON 파싱 수행
                if (youtubeResult) {
                    setYoutubeVideoId(youtubeResult); // 유튜브 videoId 저장
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (query) {
            fetchResult();
        }
    }, [query]);

    return (
        <div>
            <h1>검색 결과: "{query}"</h1>

            {cityData ? (
                <div>
                    <h2>{cityData.cityName}</h2>
                    <img src={cityData.photo} alt={cityData.cityName} style={{ width: "300px" }} />
                    <p>{cityData.description}</p>
                    <p>화폐: {cityData.currency}</p>
                    <p>언어: {cityData.language}</p>
                    <p>추천 날씨: {cityData.weather}</p>
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

            {/* 유튜브 영상 영역 */}
            <div>
                <h1>유튜브 영상</h1>
                {youtubeVideoId ? (
                    <YouTubeEmbed videoId={youtubeVideoId} />
                ) : (
                    <p>유튜브 영상을 불러오는 중...</p>
                )}
            </div>
        </div>
    );
}

export default ResultPage;

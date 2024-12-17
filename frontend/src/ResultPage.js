import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import YouTubeEmbed from "./YouTubeEmbed";

function ResultPage() {
    const [cityData, setCityData] = useState(null);
    const [wikipediaData, setWikipediaData] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = decodeURIComponent(queryParams.get("query"));

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const cityResponse = await fetch(`/api/cities?cityName=${encodeURIComponent(query)}`);
                const cityResult = await cityResponse.json();

                if (cityResult.found) {
                    setCityData(cityResult.data);
                } else {
                    const wikipediaResponse = await fetch(`/api/wikipedia/search?query=${encodeURIComponent(query)}`);
                    const wikipediaResult = await wikipediaResponse.json();
                    setWikipediaData(wikipediaResult);
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
                    {cityData.domestic ? (
                        // 해외일 때만 비행시간, 비자 정보, 시차 표시
                        <>
                            {cityData.flightTime && <p>비행시간: {cityData.flightTime}시간</p>}
                            {cityData.visaInfo && <p>비자 정보: {cityData.visaInfo}</p>}
                            {cityData.timeDiff && <p>시차: {cityData.timeDiff}</p>}
                        </>
                    ) : null}
                    <p>화폐: {cityData.currency}</p>
                    <p>언어: {cityData.language}</p>
                    <p>추천 날씨: {cityData.weather}</p>
                    <p>추천 옷차림: {cityData.clothes}</p>
                    <p>추천 여행 기간: {cityData.period}</p>
                    <p>예상 비용: {cityData.expense}</p>
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
                <h1>유튜브 영상</h1>
                <YouTubeEmbed videoId="_pJ9ZKmZFOQ" />
            </div>
        </div>
    );
}

export default ResultPage;

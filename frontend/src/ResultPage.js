import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import YouTubeEmbed from "./YouTubeEmbed";
import { Container, Box, Typography, Card, CardContent, Select, MenuItem, FormControl, InputLabel, Button, CircularProgress } from "@mui/material";
import Header from "./Header";
import "./ResultPage.css";

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
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Header />
            <Typography variant="h4" align="center" gutterBottom>
                검색 결과: "{query}"
            </Typography>

            {categories.length > 0 ? (
                <Box mb={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <FormControl fullWidth variant="outlined" sx={{ maxWidth: 400 }}>
                        <InputLabel>카테고리 선택</InputLabel>
                        <Select value={selectedCategory?.categoryName || ''} onChange={handleCategoryChange} label="카테고리 선택">
                            {categories.map((category, index) => (
                                <MenuItem key={index} value={category.categoryName}>
                                    {category.categoryName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedCategory && (
                        <Card sx={{ maxWidth: 800, marginTop: 4, mx: "auto" }}>
                            <CardContent>
                                <Typography variant="h5" align="center">{selectedCategory.cityDetails.cityName}</Typography>
                                <Box mt={2} display="flex" justifyContent="center">
                                    <img
                                        src={selectedCategory.cityDetails.photo}
                                        alt={selectedCategory.cityDetails.cityName}
                                        className="category-img"
                                    />
                                </Box>
                                <Typography variant="body1" mt={2}>
                                    {selectedCategory.cityDetails.description}
                                </Typography>
                                {selectedCategory.cityDetails.domestic && (
                                    <>
                                        {selectedCategory.cityDetails.flightTime && <Typography variant="body2" color="textSecondary">비행시간: {selectedCategory.cityDetails.flightTime}시간</Typography>}
                                        {selectedCategory.cityDetails.visaInfo && <Typography variant="body2" color="textSecondary">비자 정보: {selectedCategory.cityDetails.visaInfo}</Typography>}
                                        {selectedCategory.cityDetails.timeDiff && <Typography variant="body2" color="textSecondary">시차: {selectedCategory.cityDetails.timeDiff}</Typography>}
                                    </>
                                )}
                                <Typography variant="body2" color="textSecondary">화폐: {selectedCategory.cityDetails.currency}</Typography>
                                <Typography variant="body2" color="textSecondary">언어: {selectedCategory.cityDetails.language}</Typography>
                                <Typography variant="body2" color="textSecondary">추천 날씨: {selectedCategory.cityDetails.weather}</Typography>
                                <Typography variant="body2" color="textSecondary">추천 옷차림: {selectedCategory.cityDetails.clothes}</Typography>
                                <Typography variant="body2" color="textSecondary">추천 여행 기간: {selectedCategory.cityDetails.period}</Typography>
                                <Typography variant="body2" color="textSecondary">예상 비용: {selectedCategory.cityDetails.expense}</Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            ) : wikipediaData ? (
                <Box mb={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Card sx={{ maxWidth: 800, mx: "auto" }}>
                        <CardContent>
                            <Typography variant="h5" align="center">{wikipediaData.title}</Typography>
                            {wikipediaData.thumbnail && (
                                <Box mt={2} mb={2}>
                                    <img src={wikipediaData.thumbnail} alt={wikipediaData.title} className="wikipedia-img" />
                                </Box>
                            )}
                            <Typography variant="body1">{wikipediaData.extract}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            ) : (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            )}

            <Box mb={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    블로그 추천
                </Typography>
                {blogData.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {blogData.map((blog, index) => (
                            <li key={index}>
                                <Button component="a" href={blog.link} target="_blank" rel="noopener noreferrer" fullWidth variant="outlined" sx={{ mb: 1 }}>
                                    {blog.title}
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography variant="body1" align="center">블로그 데이터를 불러오는 중...</Typography>
                )}
            </Box>

            <Box mb={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    유튜브 영상
                </Typography>
                {youtubeVideoId ? <YouTubeEmbed videoId={youtubeVideoId} /> : <Typography variant="body1" align="center">유튜브 영상을 불러오는 중...</Typography>}
            </Box>
        </Container>
    );
}

export default ResultPage;

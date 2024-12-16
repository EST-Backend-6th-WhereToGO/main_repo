package com.howmuch.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BlogApiService {

    @Value("${naver.api.client-id}")
    private String clientId;

    @Value("${naver.api.client-secret}")
    private String clientSecret;

    public List<Map<String, String>> searchBlog(String query) {
        try {
            // 도시명 + 여행
            String fixedKeyword = "여행";
            String encodedQuery = URLEncoder.encode(query + fixedKeyword, StandardCharsets.UTF_8);
            String apiURL = "https://openapi.naver.com/v1/search/blog?query=" + encodedQuery;

            // 네이버 API 호출
            HttpURLConnection connection = (HttpURLConnection) new URL(apiURL).openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("X-Naver-Client-Id", clientId);
            connection.setRequestProperty("X-Naver-Client-Secret", clientSecret);

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                return parseResponse(response.toString()); // JSON 형태로 반환
            } else {
                throw new RuntimeException("API 호출 실패: HTTP " + responseCode);
            }
        } catch (Exception e) {
            throw new RuntimeException("네이버 API 호출 중 오류 발생", e);
        }
    }

    private List<Map<String, String>> parseResponse(String jsonResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);

            List<Map<String, String>> results = new ArrayList<>();
            JsonNode items = rootNode.get("items");

            // title과 link만 포함된 리스트 반환
            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    Map<String, String> result = new HashMap<>();
                    String title = item.get("title").asText().replaceAll("<[^>]*>", ""); // HTML 태그 제거
                    String link = item.get("link").asText();
                    result.put("title", title);
                    result.put("link", link);
                    results.add(result);
                }
            }
            return results;
        } catch (Exception e) {
            throw new RuntimeException("JSON 응답 파싱 중 오류 발생", e);
        }
    }
}


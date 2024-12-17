package com.howmuch.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WikipediaService {

	private static final String BASE_URL = "https://ko.wikipedia.org/w/api.php";

	public Map<String, Object> searchArticles(String query) {
		RestTemplate restTemplate = new RestTemplate();

		try {
			// 검색 API 호출 URL 구성
			String searchUrl = BASE_URL + "?action=query"
				+ "&list=search"
				+ "&srsearch=" + query
				+ "&format=json"
				+ "&origin=*";

			// 검색 API 호출
			Map<String, Object> searchResponse = restTemplate.getForObject(searchUrl, Map.class);
			Map<String, Object> queryResult = (Map<String, Object>) searchResponse.get("query");
			List<Map<String, Object>> searchResults = (List<Map<String, Object>>) queryResult.get("search");

			if (searchResults.isEmpty()) {
				throw new RuntimeException("No results found for query: " + query);
			}

			// 첫 번째 결과의 pageid 가져오기
			int pageId = (int) searchResults.get(0).get("pageid");
			return getArticleDetails(pageId);
		} catch (Exception e) {
			throw new RuntimeException("Failed to fetch Wikipedia data", e);
		}
	}

	private Map<String, Object> getArticleDetails(int pageId) {
		RestTemplate restTemplate = new RestTemplate();

		try {
			// 문서 세부 정보 호출 URL
			String detailUrl = BASE_URL + "?action=query"
				+ "&prop=extracts|pageimages"
				+ "&format=json"
				+ "&exintro&explaintext"
				+ "&piprop=thumbnail&pithumbsize=200"
				+ "&pageids=" + pageId
				+ "&origin=*";

			// 디버깅 로그 추가
			System.out.println("Final Detail API URL: " + detailUrl);

			// 문서 API 호출
			Map<String, Object> detailResponse = restTemplate.getForObject(detailUrl, Map.class);
			Map<String, Object> queryResult = (Map<String, Object>) detailResponse.get("query");
			Map<String, Object> pages = (Map<String, Object>) queryResult.get("pages");

			// 첫 번째 문서의 데이터 반환
			Map<String, Object> page = (Map<String, Object>) pages.values().iterator().next();
			Map<String, Object> articleDetails = new HashMap<>();
			articleDetails.put("title", page.get("title"));
			articleDetails.put("extract", page.get("extract"));
			if (page.get("thumbnail") != null) {
				Map<String, Object> thumbnail = (Map<String, Object>) page.get("thumbnail");
				articleDetails.put("thumbnail", thumbnail.get("source"));
			}
			return articleDetails;
		} catch (Exception e) {
			throw new RuntimeException("Failed to fetch article details", e);
		}
	}
}

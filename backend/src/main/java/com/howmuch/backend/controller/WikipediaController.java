package com.howmuch.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.regex.Pattern;

import com.howmuch.backend.service.CategoryService;
import com.howmuch.backend.service.WikipediaService;

@RestController
public class WikipediaController {

	private final WikipediaService wikipediaService;

	public WikipediaController(WikipediaService wikipediaService) {
		this.wikipediaService = wikipediaService;
	}

	// 한글 검증을 위한 정규식
	private static final Pattern KOREAN_PATTERN = Pattern.compile("^[가-힣ㄱ-ㅎㅏ-ㅣ\\s]+$");

	@GetMapping("/api/wikipedia/search")
	public Map<String, Object> searchArticle(@RequestParam String query) {
		// 클라이언트에서 전달된 query를 URL 디코딩
		String decodedQuery = URLDecoder.decode(query, StandardCharsets.UTF_8);

		// 한글만 허용
		if (!KOREAN_PATTERN.matcher(decodedQuery).matches()) {
			throw new IllegalArgumentException("검색어는 한글로만 입력 가능합니다.");
		}

		return wikipediaService.searchArticles(decodedQuery);
	}
}

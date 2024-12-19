package com.howmuch.backend.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class ExchangeRateService {

	private static final String API_PATH = "/site/program/financial/exchangeJSON";
	private static final String API_KEY = "4vD8hGN0N8fLk1UAMmYkfiA6W3Atm15K";

	private final WebClient webClient;
	private List<Map<String, Object>> cachedRates;

	public ExchangeRateService(WebClient webClient) {
		this.webClient = webClient;
	}

	@Scheduled(fixedRate = 600000) // 10분마다 실행
	public void updateExchangeRates() {
		int daysBack = 0;
		List<Map<String, Object>> rates = null;

		while (true) {
			String date = LocalDate.now().minusDays(daysBack).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
			System.out.println("Attempting to fetch exchange rates for date: " + date);
			rates = fetchExchangeRates(date).block(); // WebClient 결과를 동기적으로 처리

			if (rates != null && !rates.isEmpty()) {
				System.out.println("Successfully fetched exchange rates for date: " + date);
				break; // 데이터가 있으면 루프 종료
			}

			daysBack++;
		}

		if (rates != null) {
			cachedRates = rates.stream()
				.filter(rate -> !"KRW".equals(rate.get("cur_unit"))) // `KRW` 제외
				.toList();
		}
	}

	@Cacheable("exchangeRates")
	public List<Map<String, Object>> getExchangeRates() {
		return cachedRates;
	}

	private Mono<List<Map<String, Object>>> fetchExchangeRates(String date) {
		return webClient.get()
			.uri(uriBuilder -> uriBuilder
				.path(API_PATH)
				.queryParam("authkey", API_KEY)
				.queryParam("data", "AP01")
				.queryParam("searchdate", date)
				.build())
			.retrieve()
			.bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {}) // 명확한 반환 타입 지정
			.onErrorResume(e -> {
				System.err.println("Error fetching exchange rates for date: " + date + " - " + e.getMessage());
				return Mono.empty(); // 에러 발생 시 빈 결과 반환
			});
	}
}
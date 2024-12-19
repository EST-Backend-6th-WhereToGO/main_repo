package com.howmuch.backend.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ExchangeRateService {

	private static final String BASE_URL = "https://www.koreaexim.go.kr";
	private static final String API_PATH = "/site/program/financial/exchangeJSON";
	private static final String API_KEY = "4vD8hGN0N8fLk1UAMmYkfiA6W3Atm15K";

	private final RestTemplate restTemplate;
	private List<Map<String, Object>> cachedRates;

	public ExchangeRateService() {
		this.restTemplate = new RestTemplate();
	}

	@Scheduled(fixedRate = 600000) // 10분마다 실행
	public void updateExchangeRates() {
		int daysBack = 0;
		List<Map<String, Object>> rates = null;

		while (true) {
			String date = LocalDate.now().minusDays(daysBack).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
			System.out.println("Attempting to fetch exchange rates for date: " + date);
			rates = fetchExchangeRates(date);

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

	private List<Map<String, Object>> fetchExchangeRates(String date) {
		String url = String.format("%s%s?authkey=%s&data=AP01&searchdate=%s", BASE_URL, API_PATH, API_KEY, date);

		try {
			ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
			return response.getBody();
		} catch (Exception e) {
			System.err.println("Error fetching exchange rates for date: " + date + " - " + e.getMessage());
			return null;
		}
	}
}

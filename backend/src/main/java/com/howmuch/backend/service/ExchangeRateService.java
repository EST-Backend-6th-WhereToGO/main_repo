package com.howmuch.backend.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class ExchangeRateService {

	private static final String API_URL = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON";
	private static final String API_KEY = "4vD8hGN0N8fLk1UAMmYkfiA6W3Atm15K";

	private List<Map<String, Object>> cachedRates;

	@Scheduled(fixedRate = 120000) // 2분마다 실행
	public void updateExchangeRates() {
		String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
		cachedRates = fetchExchangeRates(today);

		if (cachedRates == null || cachedRates.isEmpty()) {
			String yesterday = LocalDate.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
			cachedRates = fetchExchangeRates(yesterday);
		}

		// `KRW` 데이터를 필터링
		if (cachedRates != null) {
			cachedRates = cachedRates.stream()
				.filter(rate -> !"KRW".equals(rate.get("cur_unit")))
				.toList();
		}
	}

	@Cacheable("exchangeRates")
	public List<Map<String, Object>> getExchangeRates() {
		return cachedRates;
	}

	private List<Map<String, Object>> fetchExchangeRates(String date) {
		RestTemplate restTemplate = new RestTemplate();
		String url = API_URL + "?authkey=" + API_KEY + "&data=AP01";

		try {
			return restTemplate.getForObject(url, List.class);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}


package com.howmuch.backend.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import com.howmuch.backend.repository.CityRepository;

@Service
public class WeatherService {

	private static final String API_URL = "https://api.weatherapi.com/v1/current.json";
	private static final String API_KEY = "42d18ce9b3514c5d83410915240612";

	private final CityRepository cityRepository;
	private List<Map<String, Object>> cachedWeatherData;
	private boolean isInitialized = false;
	private boolean isUpdating = false; // 중복 업데이트 방지 플래그

	public WeatherService(CityRepository cityRepository) {
		this.cityRepository = cityRepository;
	}

	@EventListener(ContextRefreshedEvent.class)
	public void initializeWeatherData() {
		if (!isInitialized) {
			updateWeatherData();
			isInitialized = true;
		}
	}

	@Scheduled(fixedRate = 600000, initialDelay = 30000) // 10분마다 실행, 초기 지연 30초
	public synchronized void updateWeatherData() {
		if (isUpdating) {
			System.out.println("Update already in progress. Skipping this update cycle.");
			return;
		}

		isUpdating = true; // 업데이트 시작
		RestTemplate restTemplate = new RestTemplate();

		try {
			List<Object[]> cities = cityRepository.findAllCityNamesAndEngCityNames();
			Set<String> uniqueCityNames = new HashSet<>();

			// 비동기 호출 처리
			List<CompletableFuture<Map<String, Object>>> futures = cities.stream()
				.filter(city -> uniqueCityNames.add((String) city[1])) // 영어 도시 이름 기준 중복 제거
				.map(city -> fetchWeatherDataAsync(restTemplate, (String) city[0], (String) city[1]))
				.collect(Collectors.toList());

			// 모든 비동기 작업 완료 대기
			List<Map<String, Object>> newWeatherData = futures.stream()
				.map(CompletableFuture::join) // 결과 가져오기
				.filter(Objects::nonNull) // null 제거
				.collect(Collectors.toList());

			if (!newWeatherData.isEmpty()) {
				cachedWeatherData = newWeatherData;
				System.out.println("Weather data updated: " + cachedWeatherData);
			} else {
				System.err.println("No weather data found during update.");
			}
		} catch (Exception e) {
			System.err.println("Failed to update weather data: " + e.getMessage());
		} finally {
			isUpdating = false; // 업데이트 종료
		}
	}

	@Cacheable(value = "weatherData", unless = "#result == null || #result.isEmpty()")
	public synchronized List<Map<String, Object>> getWeatherData() {
		if (isUpdating) {
			System.out.println("Data is being updated. Returning current cached data.");
			return cachedWeatherData;
		}

		if (cachedWeatherData == null || cachedWeatherData.isEmpty()) {
			System.err.println("No cached weather data available. Triggering update...");
			updateWeatherData();
		}
		return cachedWeatherData;
	}

	@Async
	public CompletableFuture<Map<String, Object>> fetchWeatherDataAsync(RestTemplate restTemplate, String cityName, String engCityName) {
		try {
			String url = API_URL + "?key=" + API_KEY + "&q=" + engCityName;
			System.out.println("Fetching weather for: " + url);
			Map<String, Object> weatherResponse = restTemplate.getForObject(url, Map.class);

			if (weatherResponse == null || !weatherResponse.containsKey("current")) {
				System.err.println("No weather data found for: " + engCityName);
				return CompletableFuture.completedFuture(null);
			}

			Map<String, Object> weatherData = new HashMap<>();
			weatherData.put("cityName", cityName);
			weatherData.put("weather", weatherResponse);

			return CompletableFuture.completedFuture(weatherData);
		} catch (Exception e) {
			System.err.println("Error fetching weather for city: " + engCityName + " - " + e.getMessage());
			return CompletableFuture.completedFuture(null);
		}
	}
}

package com.howmuch.backend.service;

import com.howmuch.backend.repository.CityRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class WeatherService {

	private static final String API_URL = "https://api.weatherapi.com/v1/current.json";
	private static final String API_KEY = "42d18ce9b3514c5d83410915240612";

	private final CityRepository cityRepository;
	private List<Map<String, Object>> cachedWeatherData;

	public WeatherService(CityRepository cityRepository) {
		this.cityRepository = cityRepository;
	}

	// Spring 컨텍스트 초기화 후 실행
	@EventListener(ContextRefreshedEvent.class)
	public void initializeWeatherData() {
		updateWeatherData();
	}

	// 5분마다 날씨 데이터 갱신
	@Scheduled(fixedRate = 300000)
	public synchronized void updateWeatherData() {
		RestTemplate restTemplate = new RestTemplate();
		try {
			// DB에서 모든 도시 이름 조회
			List<Object[]> cities = cityRepository.findAllCityNamesAndEngCityNames();

			// 중복 제거를 위해 Set 사용
			Set<String> uniqueCityNames = new HashSet<>();
			cachedWeatherData = cities.stream()
				.filter(city -> uniqueCityNames.add((String) city[1])) // 영어 도시 이름 기준 중복 제거
				.map(city -> fetchWeatherData(restTemplate, (String) city[0], (String) city[1]))
				.filter(data -> data != null)
				.collect(Collectors.toList());

			System.out.println("Weather data updated: " + cachedWeatherData);
		} catch (Exception e) {
			System.err.println("Failed to update weather data: " + e.getMessage());
		}
	}

	@Cacheable("weatherData")
	public List<Map<String, Object>> getWeatherData() {
		if (cachedWeatherData == null || cachedWeatherData.isEmpty()) {
			System.err.println("No cached weather data available. Triggering update...");
			updateWeatherData();
		}
		return cachedWeatherData;
	}

	private Map<String, Object> fetchWeatherData(RestTemplate restTemplate, String cityName, String engCityName) {
		try {
			String url = API_URL + "?key=" + API_KEY + "&q=" + engCityName;
			System.out.println("Fetching weather for: " + url);
			Map<String, Object> weatherResponse = restTemplate.getForObject(url, Map.class);

			if (weatherResponse == null || !weatherResponse.containsKey("current")) {
				System.err.println("No weather data found for: " + engCityName);
				return null;
			}

			Map<String, Object> weatherData = new HashMap<>();
			weatherData.put("cityName", cityName);
			weatherData.put("weather", weatherResponse);

			return weatherData;
		} catch (Exception e) {
			System.err.println("Error fetching weather for city: " + engCityName + " - " + e.getMessage());
			return null;
		}
	}
}

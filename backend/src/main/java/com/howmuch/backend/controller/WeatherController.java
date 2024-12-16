package com.howmuch.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import com.howmuch.backend.service.WeatherService;

@RestController
public class WeatherController {

	private final WeatherService weatherService;

	public WeatherController(WeatherService weatherService) {
		this.weatherService = weatherService;
	}

	@GetMapping("/api/weather")
	public List<Map<String, Object>> getWeather() {
		List<Map<String, Object>> weatherData = weatherService.getWeatherData();
		if (weatherData == null || weatherData.isEmpty()) {
			throw new RuntimeException("No cached weather data available. Please try again later.");
		}
		return weatherData;
	}
}

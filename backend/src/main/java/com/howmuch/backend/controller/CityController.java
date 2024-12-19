package com.howmuch.backend.controller;

import com.howmuch.backend.entity.DTO.CityDTO;
import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.repository.CityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.DTO.CityResponse;
import com.howmuch.backend.service.CityService;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;
	private final CityRepository cityRepository;

    public CityController(CityService cityService , CityRepository cityRepository) {
		this.cityService = cityService;
		this.cityRepository = cityRepository;
    }

    @GetMapping("/{categoryId}") // 카테고리별 도시 불러오는
    public ResponseEntity<List<CityResponse>> getCitiesByCategory(@PathVariable Long categoryId) {
        List<City> cities = cityService.getCitiesByCategory(categoryId);

		List<CityResponse> response = cities.stream()
			.map(city -> new CityResponse(city.getCityId(), city.getCityName())) // cityId 포함
			.toList();

        return ResponseEntity.ok(response);
    }

	@GetMapping
	public ResponseEntity<?> getCityByName(@RequestParam String cityName) {
		Optional<City> city = cityRepository.findByCityName(cityName);

		if (city.isPresent()) {
			CityDTO cityDTO = new CityDTO(city.get());
			return ResponseEntity.ok(Map.of(
				"found", true,
				"data", cityDTO
			));
		} else {
			return ResponseEntity.ok(Map.of(
				"found", false
			));
		}
	}

	@GetMapping("/search")
	public ResponseEntity<?> getCityByNameWithCategories(@RequestParam String cityName) {
		List<City> cities = cityRepository.findAllByCityName(cityName);

		if (!cities.isEmpty()) {
			List<Map<String, Object>> cityData = cities.stream()
				.map(city -> {
					Map<String, Object> cityDetails = new HashMap<>();
					cityDetails.put("cityName", city.getCityName());
					cityDetails.put("description", city.getDescription());
					cityDetails.put("photo", city.getPhoto());
					cityDetails.put("domestic", city.isDomestic());
					cityDetails.put("flightTime", city.getFlightTime());
					cityDetails.put("visaInfo", city.getVisaInfo());
					cityDetails.put("timeDiff", city.getTimeDiff());
					cityDetails.put("currency", city.getCurrency());
					cityDetails.put("language", city.getLanguage());
					cityDetails.put("weather", city.getWeather());
					cityDetails.put("clothes", city.getClothes());
					cityDetails.put("period", city.getPeriod());
					cityDetails.put("expense", city.getExpense());

					Map<String, Object> categoryMap = new HashMap<>();
					categoryMap.put("categoryName", city.getCategory() != null ? city.getCategory().getCategoryName() : "Unknown Category");
					categoryMap.put("cityDetails", cityDetails);

					return categoryMap;
				})
				.toList();

			return ResponseEntity.ok(Map.of(
				"found", true,
				"categories", cityData
			));
		} else {
			return ResponseEntity.ok(Map.of(
				"found", false,
				"message", "City not found in the database."
			));
		}
	}

}

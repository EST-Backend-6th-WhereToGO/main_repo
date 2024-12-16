package com.howmuch.backend.controller;

import com.howmuch.backend.entity.DTO.CityDTO;
import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.repository.CityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CityController {

	private final CityRepository cityRepository;

	public CityController(CityRepository cityRepository) {
		this.cityRepository = cityRepository;
	}

	@GetMapping("/cities")
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
}

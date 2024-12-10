package com.howmuch.backend.controller;

import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.dto.CityResponse;
import com.howmuch.backend.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/{categoryId}") // 카테고리별 도시 불러오는
    public ResponseEntity<List<CityResponse>> getCitiesByCategory(@PathVariable Long categoryId) {
        List<City> cities = cityService.getCitiesByCategory(categoryId);

        List<CityResponse> response = cities.stream()
                .map(city -> new CityResponse(city.getCityName()))
                .toList();

        return ResponseEntity.ok(response);
    }
}

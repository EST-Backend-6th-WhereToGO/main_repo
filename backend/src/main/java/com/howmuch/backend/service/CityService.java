package com.howmuch.backend.service;

import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.repository.CityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {
    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public List<City> getCitiesByCategory(Long categoryId) {
        return cityRepository.findCitiesByCategoryId(categoryId);
    }

    public City getCityById(Long cityId) {
        return cityRepository.findById(cityId).orElseThrow();
    }
}

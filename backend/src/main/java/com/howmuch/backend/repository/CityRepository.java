package com.howmuch.backend.repository;

import com.howmuch.backend.entity.city_info.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

	@Query("SELECT c.cityName, c.engCityName FROM City c WHERE c.engCityName IS NOT NULL")
	List<Object[]> findAllCityNamesAndEngCityNames();

	Optional<City> findByCityName(String cityName);
}

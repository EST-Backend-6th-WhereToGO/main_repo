package com.howmuch.backend.repository;

import com.howmuch.backend.entity.city_info.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    @Query("SELECT c FROM City c WHERE c.category.categoryId = :categoryId")
    List<City> findCitiesByCategoryId(@Param("categoryId") Long categoryId);
}
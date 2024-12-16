package com.howmuch.backend.repository;

import com.howmuch.backend.entity.city_info.Category;
import jakarta.annotation.Nonnull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Nonnull
    List<Category> findAll(); // 목적 리스트 조회

    Category findByCategoryName(String categoryName);
}

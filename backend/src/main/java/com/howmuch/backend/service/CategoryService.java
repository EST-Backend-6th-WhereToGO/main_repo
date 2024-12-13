package com.howmuch.backend.service;

import com.howmuch.backend.entity.city_info.Category;
import com.howmuch.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Long findCategoryIdByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName).getCategoryId();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}

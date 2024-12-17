package com.howmuch.backend.service;

import com.howmuch.backend.entity.DTO.CategoryDTO;

import com.howmuch.backend.entity.city_info.Category;
import com.howmuch.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
	private final CategoryRepository categoryRepository;

	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public List<CategoryDTO> getAllCategories() {
		return categoryRepository.findAll()
			.stream()
			.map(category -> new CategoryDTO(
				category.getCategoryId(), // 올바른 Getter 메서드 호출
				category.getCategoryName() // 올바른 Getter 메서드 호출
			))
			.collect(Collectors.toList());
	}

	public Long findCategoryIdByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName).getCategoryId();
    }
}

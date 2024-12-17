package com.howmuch.backend.controller;

import com.howmuch.backend.entity.DTO.CategoryDTO;
import com.howmuch.backend.service.CategoryService;
import com.howmuch.backend.entity.city_info.Category;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

	@GetMapping // category 리스트 불러오는
	public ResponseEntity<List<String>> getAllCategories() {
		List<String> categoryNames = categoryService.getAllCategories()
			.stream()
			.map(CategoryDTO::getName) // CategoryDTO의 getName() 참조
			.toList();
		return ResponseEntity.ok(categoryNames);
	}

	@GetMapping("/categories")
	public List<CategoryDTO> getCategories() {
		return categoryService.getAllCategories();
	}

}

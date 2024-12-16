package com.howmuch.backend.controller;

import com.howmuch.backend.entity.DTO.CategoryDTO;
import com.howmuch.backend.service.CategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {
	private final CategoryService categoryService;

	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@GetMapping("/categories")
	public List<CategoryDTO> getCategories() {
		return categoryService.getAllCategories();
	}
}

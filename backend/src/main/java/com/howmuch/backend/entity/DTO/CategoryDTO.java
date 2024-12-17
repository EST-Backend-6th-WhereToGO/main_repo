package com.howmuch.backend.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@AllArgsConstructor
public class CategoryDTO {
	private Long id;
	private String name;
}

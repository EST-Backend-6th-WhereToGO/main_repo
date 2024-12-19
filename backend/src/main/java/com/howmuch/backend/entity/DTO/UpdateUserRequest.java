package com.howmuch.backend.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
	private String nickname;
	private int age;
	private String gender;
	private String mbti;
	private String region;
	private String city;
}

package com.howmuch.backend.entity.DTO;

import lombok.Data;

@Data
public class UserResponseDTO {
	private String nickname;
	private int age;
	private String gender;
	private String mbti;
	private String region;
	private String city;

	public UserResponseDTO(String nickname, int age, String gender, String mbti, String region, String city) {
		this.nickname = nickname;
		this.age = age;
		this.gender = gender;
		this.mbti = mbti;
		this.region = region;
		this.city = city;
	}
}

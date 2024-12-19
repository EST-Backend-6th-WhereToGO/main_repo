package com.howmuch.backend.controller;

import com.howmuch.backend.entity.DTO.UpdateUserRequest;
import com.howmuch.backend.entity.DTO.UserResponseDTO;
import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.UserRepository;
import com.howmuch.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;
	private final UserRepository userRepository;

	public UserController(UserService userService, UserRepository userRepository) {
		this.userService = userService;
		this.userRepository = userRepository;
	}

	// 회원 저장 API
	@PostMapping("/save")
	public ResponseEntity<?> saveUser(@RequestBody User user) {
		try {
			User savedUser = userService.saveUser(user);
			return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("오류 발생: " + e.getMessage());
		}
	}

	@GetMapping("/check")
	public ResponseEntity<Boolean> checkUserExists(@RequestParam String email) {
		boolean exists = userRepository.existsByEmail(email);
		return ResponseEntity.ok(exists);
	}

	@GetMapping("/me")
	public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal OAuth2User principal) {
		if (principal == null) {
			return ResponseEntity.status(401).body("Unauthorized");
		}

		String email = principal.getAttribute("email");

		// 사용자 정보를 데이터베이스에서 가져옴
		User user = userRepository.findByEmail(email)
			.orElse(null);

		if (user == null) {
			return ResponseEntity.status(404).body("User not found");
		}

		// DTO로 변환하여 응답
		UserResponseDTO responseDto = new UserResponseDTO(
			user.getNickname(),
			user.getAge(),
			user.getGender(),
			user.getMbti(),
			user.getRegion(),
			user.getCity()
		);

		return ResponseEntity.ok(responseDto);
	}

	@PutMapping("/update")
	public ResponseEntity<?> updateUserInfo(@AuthenticationPrincipal OAuth2User principal,
		@Valid @RequestBody UpdateUserRequest request) {
		if (principal == null) {
			return ResponseEntity.status(401).body("Unauthorized");
		}

		String email = principal.getAttribute("email");

		// 사용자 조회
		User user = userRepository.findByEmail(email).orElse(null);
		if (user == null) {
			return ResponseEntity.status(404).body("User not found");
		}

		// 사용자 정보 업데이트
		user.setNickname(request.getNickname());
		user.setAge(request.getAge());
		user.setGender(request.getGender());
		user.setMbti(request.getMbti());
		user.setRegion(request.getRegion());
		user.setCity(request.getCity());

		userRepository.save(user); // 변경 사항 저장

		return ResponseEntity.ok("User information updated successfully");
	}
}

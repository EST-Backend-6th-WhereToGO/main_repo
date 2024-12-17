package com.howmuch.backend.controller;

import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.UserRepository;
import com.howmuch.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}

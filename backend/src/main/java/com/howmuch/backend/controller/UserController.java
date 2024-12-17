package com.howmuch.backend.controller;

import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/check")
	public ResponseEntity<?> checkUser(@RequestParam String email) {
		Optional<User> user = userService.findByEmail(email);
		if (user.isPresent()) {
			return ResponseEntity.ok(user.get());
		} else {
			return ResponseEntity.status(404).body("User not found");
		}
	}

	@PostMapping("/save")
	public ResponseEntity<?> saveUser(@RequestBody User user) {
		User savedUser = userService.saveUser(user);
		return ResponseEntity.ok(savedUser);
	}
}

package com.howmuch.backend.controller;

import com.howmuch.backend.service.UserService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

	private final UserService userService;

	public AuthController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/api/auth/success")
	public Map<String, Object> loginSuccess(OAuth2AuthenticationToken authentication) {
		return authentication.getPrincipal().getAttributes();
	}

	@GetMapping("/api/auth/status")
	public Map<String, Object> checkLoginStatus(OAuth2AuthenticationToken authentication) {
		if (authentication != null) {
			String email = authentication.getPrincipal().getAttribute("email");
			Long userId = userService.getUserIdByEmail(email);

			return Map.of("status", "LoggedIn", "email", email, "userId", userId);
		}

		return Map.of("status", "LoggedOut");
	}
}

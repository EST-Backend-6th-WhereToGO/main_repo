package com.howmuch.backend.controller;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

	@GetMapping("/api/auth/success")
	public Map<String, Object> loginSuccess(OAuth2AuthenticationToken authentication) {
		return authentication.getPrincipal().getAttributes();
	}

	@GetMapping("/api/auth/status")
	public Map<String, String> checkLoginStatus(OAuth2AuthenticationToken authentication) {
		if (authentication != null) {
			String email = authentication.getPrincipal().getAttribute("email");
			return Map.of("status", "LoggedIn", "email", email);
		}
		return Map.of("status", "LoggedOut");
	}
}

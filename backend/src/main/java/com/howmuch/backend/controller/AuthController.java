package com.howmuch.backend.controller;

import com.howmuch.backend.service.UserService;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

	@GetMapping("/api/auth/logout")
	public Map<String, String> logout(HttpServletRequest request, HttpServletResponse response) {
		// 현재 인증 정보를 가져옵니다
		var authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication != null) {
			// Spring Security의 SecurityContextLogoutHandler를 사용해 로그아웃 처리
			new SecurityContextLogoutHandler().logout(request, response, authentication);
		}

		// 로그아웃 완료 메시지를 반환
		return Map.of("message", "Successfully logged out");
	}
}

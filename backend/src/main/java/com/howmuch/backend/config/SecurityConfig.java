package com.howmuch.backend.config;

import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class SecurityConfig {

	private final UserRepository userRepository;

	public SecurityConfig(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.authorizeHttpRequests(auth -> auth
				.anyRequest().permitAll()
			)
			.oauth2Login(oauth2 -> oauth2
				.successHandler(customSuccessHandler())
			);

		return http.build();
	}

	// Custom SuccessHandler 구현
	private AuthenticationSuccessHandler customSuccessHandler() {
		return (request, response, authentication) -> {
			OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
			String email = token.getPrincipal().getAttribute("email");

			// DB 조회를 통해 사용자 존재 여부 확인
			boolean userExists = userRepository.existsByEmail(email);

			if (userExists) {
				// 이미 회원가입된 사용자 → Step3로 리다이렉트
				response.sendRedirect("http://localhost:3000/step3");
			} else {
				// 신규 사용자 → Step1로 리다이렉트
				response.sendRedirect("http://localhost:3000/step1?name="
						+ URLEncoder.encode(token.getPrincipal().getAttribute("name"), StandardCharsets.UTF_8)
						+ "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
						+ "&sub=" + URLEncoder.encode(token.getPrincipal().getAttribute("sub"), StandardCharsets.UTF_8));
			}
		};
	}
}

package com.howmuch.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf().disable() // CSRF 비활성화 (개발용)
			.authorizeHttpRequests(authorize -> authorize
				.anyRequest().permitAll() // 모든 요청 허용
			)
			.httpBasic().disable(); // HTTP Basic 인증 비활성화

		return http.build();
	}
}

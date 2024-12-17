package com.howmuch.backend.service;

import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

import jakarta.transaction.Transactional;

@Service
public class UserService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Transactional
	public User saveUser(User user) {
		// 중복 이메일 검사
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new IllegalStateException("이미 존재하는 이메일입니다.");
		}
		return userRepository.save(user);
	}

	public User getUserById(long userId) {
        return userRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
    }

}
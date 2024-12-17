package com.howmuch.backend.service;

import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public User saveUser(User user) {
		return userRepository.save(user);
	}

	public User getUserById(long userId) {
        return userRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
    }
}
package com.howmuch.backend.service;

import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(long userId) {
        return userRepository.findById(userId).orElseThrow();
    }
}

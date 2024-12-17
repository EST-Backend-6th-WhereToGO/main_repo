package com.howmuch.backend.repository;

import com.howmuch.backend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email); // 이메일로 사용자 조회
	boolean existsByEmail(String email); // 중복 이메일 검사
}

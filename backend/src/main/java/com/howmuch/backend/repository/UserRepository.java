package com.howmuch.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.howmuch.backend.entity.user.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
}

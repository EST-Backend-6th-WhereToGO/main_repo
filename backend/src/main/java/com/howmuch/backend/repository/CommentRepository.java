package com.howmuch.backend.repository;

import com.howmuch.backend.entity.community.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<PostComment, Long> {
}
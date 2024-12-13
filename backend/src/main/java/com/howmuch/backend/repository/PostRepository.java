package com.howmuch.backend.repository;

import com.howmuch.backend.entity.community.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface PostRepository extends JpaRepository<Post, Long> {

    // 게시물 조회 순 정렬 조회
    List<Post> findAllByOrderByViewCountDesc();

    // 게시물 좋아요 순 정렬 조회
    List<Post> findAllByOrderByLikeCountDesc();

}

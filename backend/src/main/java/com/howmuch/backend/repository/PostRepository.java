package com.howmuch.backend.repository;

import com.howmuch.backend.entity.community.Post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // 게시판 전체조회(public이 true인 것만)
    @Query("""
        SELECT p FROM Post p
        LEFT JOIN p.plan pl
        WHERE p.header = 'TIP' OR (p.header = 'TRIP' AND pl.isPublic = TRUE)
        """)
    Page<Post> findVisiblePosts(Pageable pageable);

    // header 값이 TIP인 게시글만 조회
    @Query("""
        SELECT p FROM Post p
        WHERE p.header = 'TIP'
        """)
    Page<Post> findTipPosts(Pageable pageable);

    // header 값이 TRIP이고 isPublic = TRUE인 게시글만 조회
    @Query("""
        SELECT p FROM Post p
        JOIN p.plan pl
        WHERE p.header = 'TRIP' AND pl.isPublic = TRUE
        """)
    Page<Post> findTripPosts(Pageable pageable);

    // 게시물 조회 순 정렬 조회
    @Query("""
    SELECT p FROM Post p
    LEFT JOIN p.plan pl
    WHERE pl IS NULL OR pl.isPublic = TRUE
    ORDER BY p.viewCount DESC
""")
    Page<Post> findAllByOrderByViewCountDesc(Pageable pageable);

    // 게시물 좋아요 순 정렬 조회
    @Query("""
    SELECT p FROM Post p
    LEFT JOIN p.plan pl
    WHERE pl IS NULL OR pl.isPublic = TRUE
    ORDER BY p.likeCount DESC
""")
    Page<Post> findAllByOrderByLikeCountDesc(Pageable pageable);

}
package com.howmuch.backend.repository;


import com.howmuch.backend.entity.community.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPost_PostIdAndUserId(Long postId, Long userId);
    Long countByPost_PostId(Long postId);

}

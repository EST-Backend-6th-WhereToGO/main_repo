package com.howmuch.backend.service;


import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.community.PostLike;
import com.howmuch.backend.repository.PostLikeRepository;
import com.howmuch.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;


    // 좋아요 등록
    @Transactional
    public void likePost(Long postId, Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        postLikeRepository.findByPost_PostIdAndUserId(postId, userId)
                .ifPresent(like -> {
                    throw new IllegalArgumentException("이미 좋아요를 눌렀습니다.");

                });
        PostLike postLike = new PostLike(post, userId);
        postLikeRepository.save(postLike);

        post.incrementLikeCount();
        postRepository.save(post);
    }

    // 좋아요 취소
    @Transactional
    public void unlikePost(Long postId, Long userId) {

        PostLike postLike = postLikeRepository.findByPost_PostIdAndUserId(postId, userId)
                .orElseThrow(() -> new IllegalArgumentException("좋아요 기록이 존재하지 않습니다."));

        Post post = postLike.getPost();
        postLikeRepository.delete(postLike);

        post.decrementLikeCount();
        postRepository.save(post);
    }

    // 게시물 좋아요 순 조회
    @Transactional(readOnly = true)
    public List<Post> getAllPostsByLikeCount() {
        return postRepository.findAllByOrderByLikeCountDesc();
    }

    // 게시물 조회수 증가
    @Transactional
    public void incrementViewCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
    }

    // 게시물 조회수 순 조회
    @Transactional(readOnly = true)
    public List<Post> getAllPostsByViewCount() {
        return postRepository.findAllByOrderByViewCountDesc();
    }
}

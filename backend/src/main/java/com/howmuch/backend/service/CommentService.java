package com.howmuch.backend.service;


import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.community.PostComment;
import com.howmuch.backend.repository.CommentRepository;
import com.howmuch.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository; // PostRepository 추가 필요

    public List<PostComment> getCommentsByPostId(Long postId) {
        return commentRepository.findAll().stream()
                .filter(comment -> comment.getPost().getPostId().equals(postId))
                .toList();
    }

    public Optional<PostComment> getCommentById(Long commentId) {
        return commentRepository.findById(commentId);
    }

    @Transactional
    public PostComment createComment(PostComment comment) {
        // Post 객체를 데이터베이스에서 조회
        Post post = postRepository.findById(comment.getPost().getPostId())
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + comment.getPost().getPostId()));

        // Post 객체 설정
        comment.setPost(post);

        // 댓글 저장
        return commentRepository.save(comment);
    }

    @Transactional
    public Optional<PostComment> updateComment(Long commentId, PostComment updatedComment) {
        return commentRepository.findById(commentId)
                .map(comment -> {
                    comment.setContent(updatedComment.getContent());
                    return commentRepository.save(comment);
                });
    }

    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

}
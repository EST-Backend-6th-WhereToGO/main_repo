package com.howmuch.backend.service;


import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.community.PostComment;
import com.howmuch.backend.entity.dto.CommentRequestDTO;
import com.howmuch.backend.entity.dto.CommentResponseDTO;
import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.CommentRepository;
import com.howmuch.backend.repository.PostRepository;
import com.howmuch.backend.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    public List<CommentResponseDTO> getCommentsByPostId(Long postId) {
        return commentRepository.findAll().stream()
                .filter(comment -> comment.getPost().getPostId().equals(postId))
                .map(comment -> new CommentResponseDTO(
                        comment.getCommentId(),
                        comment.getPost().getPostId(),
                        comment.getUser().getNickname(), // 유저 닉네임 가져오기
                        comment.getContent(),
                        comment.getCreatedAt(),
                        comment.getUpdatedAt()
                ))
                .toList();
    }

    public Optional<PostComment> getCommentById(Long commentId) {
        return commentRepository.findById(commentId);
    }

    @Transactional
    public CommentResponseDTO createComment(CommentRequestDTO requestDTO) {
        // Post와 User 객체 조회
        Post post = postRepository.findById(requestDTO.getPostId())
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + requestDTO.getPostId()));

        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + requestDTO.getUserId()));

        // PostComment 객체 생성 및 저장
        PostComment comment = new PostComment(post, user, requestDTO.getContent());
        PostComment createdComment = commentRepository.save(comment);

        // DTO로 변환 후 반환
        return new CommentResponseDTO(
                createdComment.getCommentId(),
                createdComment.getPost().getPostId(),
                createdComment.getUser().getNickname(), // 유저 닉네임 가져오기
                createdComment.getContent(),
                createdComment.getCreatedAt(),
                createdComment.getUpdatedAt()
        );
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
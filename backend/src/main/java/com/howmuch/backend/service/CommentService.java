package com.howmuch.backend.service;


import com.howmuch.backend.entity.community.PostComment;
import com.howmuch.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

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
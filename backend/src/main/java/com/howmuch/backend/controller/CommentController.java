package com.howmuch.backend.controller;


import com.howmuch.backend.entity.community.PostComment;
import com.howmuch.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.Optional;

@RestController

@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}/comments")
    public ResponseEntity<List<PostComment>> getCommentsByPostId(@PathVariable Long postId) {
        List<PostComment> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/comments/{commentId}")
    public ResponseEntity<PostComment> getCommentById(@PathVariable Long commentId) {
        Optional<PostComment> comment = commentService.getCommentById(commentId);
        return comment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/comments")
    public ResponseEntity<PostComment> createComment(@RequestBody PostComment comment) {
        PostComment createdComment = commentService.createComment(comment);
        return ResponseEntity.ok(createdComment);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<PostComment> updateComment(@PathVariable Long commentId, @RequestBody PostComment updatedComment) {
        Optional<PostComment> comment = commentService.updateComment(commentId, updatedComment);
        return comment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

}
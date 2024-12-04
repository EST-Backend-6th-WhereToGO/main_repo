package com.howmuch.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    // 게시글 댓글 작성
    @PostMapping("/{postId}")
    public ResponseEntity<Void> createComment() {
        return null;
    }

    // 게시글 댓글 수정 (작성자만 가능)
    @PutMapping("/{commentId}")
    public ResponseEntity<Void> modifyComment() {
        return null;
    }

    // 게시글 댓글 삭제 (작성자만 가능)
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment() {
        return null;
    }


}

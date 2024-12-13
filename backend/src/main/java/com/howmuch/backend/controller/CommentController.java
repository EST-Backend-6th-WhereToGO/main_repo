package com.howmuch.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment")
public class CommentController {


    public ResponseEntity<?> createComment() {

        return ResponseEntity.ok("작성완료");
    }

    // 게시글 댓글 수정 (작성자만 가능)
    @PutMapping("/{commentId}")
    public ResponseEntity<?> modifyComment() {

        return ResponseEntity.ok("수정완료");
    }

    // 게시글 댓글 삭제 (작성자만 가능)
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment() {

        return ResponseEntity.ok("삭제완료");
    }
}
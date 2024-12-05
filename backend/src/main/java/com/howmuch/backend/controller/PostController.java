package com.howmuch.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")

public class PostController {

    // 게시글 작성
    @PostMapping
    public ResponseEntity createPosts() {

        return ResponseEntity.ok("작성완료");
    }

    // 게시글 수정
    @PutMapping("/modify")
    public ResponseEntity modifyPosts() {

        return ResponseEntity.ok("수정완료");
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity deletePosts() {

        return ResponseEntity.ok("삭제완료");
    }

    // 게시글 전체 조회
    @GetMapping
    public ResponseEntity getPosts() {

        return ResponseEntity.ok("조회완료");
    }

    // 게시글 단건 조회
    @GetMapping("/{postId}")
    public ResponseEntity getPostId() {

        return ResponseEntity.ok("조회완료");
    }

    // 게시글 좋아요 On/Off
    @PostMapping("/{postId}/like")
    public ResponseEntity toggleLike() {

        return ResponseEntity.ok("성공적으로 처리되었습니다");
    }

    // 좋아요 수 인기게시물 조회
    @GetMapping("/by-likes")
    public ResponseEntity getPostsByLikes() {

        return ResponseEntity.ok("조회완료");
    }


    // 조회수 인기게시물 조회
    @GetMapping("/by-views")
    public ResponseEntity getPostsByViews() {

        return ResponseEntity.ok("조회완료");
    }
}
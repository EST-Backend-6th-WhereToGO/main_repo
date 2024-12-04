package com.howmuch.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")

public class PostController {

    // 게시글 작성
    @PostMapping
    public ResponseEntity createPosts() {
        return null;
    }

    // 게시글 수정
    @PutMapping("/modify")
    public ResponseEntity modifyPosts() {
        return null;
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity deletePosts() {
        return null;
    }

    // 게시글 전체 조회
    @GetMapping
    public ResponseEntity getPosts() {
        return null;
    }

    // 게시글 단건 조회
    @GetMapping("/{postId}")
    public ResponseEntity getPostId() {
        return null;
    }

    // 게시글 좋아요 On/Off
    @PostMapping("/{postId}/like")
    public ResponseEntity toggleLike() {
        return null;
    }

    // 좋아요 수 인기게시물 조회
    @GetMapping("/by-likes")
    public ResponseEntity getPostsByLikes() {
        return null;
    }


    // 조회수 인기게시물 조회
    @GetMapping("/by-views")
    public ResponseEntity getPostsByViews() {
        return null;
    }

}
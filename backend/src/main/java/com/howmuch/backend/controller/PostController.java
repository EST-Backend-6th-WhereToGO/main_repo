package com.howmuch.backend.controller;

import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.dto.AddPostRequest;
import com.howmuch.backend.entity.dto.PostResponse;
import com.howmuch.backend.entity.dto.UpdatePostRequest;
import com.howmuch.backend.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<PostResponse> createPosts(@RequestBody AddPostRequest addPostRequest, @RequestHeader("userId") Long sessionUserId) {
        PostResponse posts = postService.createPost(addPostRequest, sessionUserId); // test 목적으로 @RequestHeader 어노테이션 사용
        return ResponseEntity.ok(posts);
    }

    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long postId,
                                           @RequestBody UpdatePostRequest updateRequest) {
        Long sessionUserId = 1L; // 임시값
        PostResponse posts = postService.updatePost(postId, sessionUserId, updateRequest);
        return ResponseEntity.ok(posts);
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePosts(@PathVariable Long postId) {
        Long sessionUserId = 1L; // 임시값

        postService.deletePostById(postId, sessionUserId);
        return ResponseEntity.noContent().build();
    }

    // 게시글 전체 조회
    @GetMapping
    public ResponseEntity<Page<PostResponse>> getVisiblePosts(@RequestParam(defaultValue = "1") int page) {
        Page<PostResponse> posts = postService.getVisiblePosts(page-1);
        return ResponseEntity.ok(posts);
    }

    // 게시글 단건 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long postId) {
        PostResponse posts = postService.getPostById(postId);
        return ResponseEntity.ok(posts);
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

    // 헤더별 게시글 조회
    @GetMapping("/by-header")
    public ResponseEntity<Page<PostResponse>> getPostsByHeader(
            @RequestParam String header,
            @RequestParam(defaultValue = "1") int page) {
        Page<PostResponse> posts = postService.getPostsByHeader(header, page -1);
        return ResponseEntity.ok(posts);
    }
}
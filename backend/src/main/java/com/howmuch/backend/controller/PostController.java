package com.howmuch.backend.controller;

import com.howmuch.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.DTO.AddPostRequest;
import com.howmuch.backend.entity.DTO.PostResponse;
import com.howmuch.backend.entity.DTO.UpdatePostRequest;
import com.howmuch.backend.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")


public class PostController {
    private final PostService postService;
    private final UserService userService;

    public PostController(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<PostResponse> createPosts(@RequestBody AddPostRequest addPostRequest,
                                                    OAuth2AuthenticationToken authentication) {

        String email = authentication.getPrincipal().getAttribute("email");

        Long sessionUserId = userService.getUserIdByEmail(email);

        PostResponse posts = postService.createPost(addPostRequest, sessionUserId);

        return ResponseEntity.ok(posts);
    }

    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long postId,
                                           @RequestBody UpdatePostRequest updateRequest,
                                                   OAuth2AuthenticationToken authentication) {
        String email = authentication.getPrincipal().getAttribute("email");

        PostResponse posts = postService.updatePost(postId, email, updateRequest);
        return ResponseEntity.ok(posts);
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePosts(@PathVariable Long postId,
                                            OAuth2AuthenticationToken authentication) {

        String email = authentication.getPrincipal().getAttribute("email");

        Long sessionUserId = userService.getUserIdByEmail(email);

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
        postService.incrementViewCount(postId);
        PostResponse postResponse = postService.getPostById(postId);
        return ResponseEntity.ok(postResponse);
    }

    // 게시글 좋아요
    @PostMapping("/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId, @RequestParam Long userId) {
        postService.likePost(postId, userId);
        return ResponseEntity.ok("좋아요 등록 완료");
    }

    //게시글 좋아요 취소
    @DeleteMapping("/{postId}/like")
    public ResponseEntity<String> unlikePost(@PathVariable Long postId, @RequestParam Long userId) {
        postService.unlikePost(postId, userId);
        return ResponseEntity.ok("좋아요 취소 완료");
    }


    // 헤더별 게시글 조회
    @GetMapping("/by-header")
    public ResponseEntity<Page<PostResponse>> getPostsByHeader(
            @RequestParam String header,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String sort) {
        Page<PostResponse> posts;

        // 정렬 기준에 따라 Service 호출
        if ("views".equals(sort)) {
            posts = postService.getPostsByHeaderAndViews(header, page - 1);
        } else if ("likes".equals(sort)) {
            posts = postService.getPostsByHeaderAndLikes(header, page - 1);
        } else {
            posts = postService.getPostsByHeader(header, page - 1);
        }

        return ResponseEntity.ok(posts);
    }

    // 좋아요 상태 조회
    @GetMapping("/{postId}/like/status")
    public ResponseEntity<Boolean> getLikeStatus(@PathVariable Long postId, @RequestParam Long userId) {
        boolean isLiked = postService.isPostLikedByUser(postId, userId);
        return ResponseEntity.ok(isLiked);
    }
    // 전체 게시물 조회 - 조회수 순 정렬
    @GetMapping("/by-views")
    public ResponseEntity<Page<PostResponse>> getPostsByViews(
            @RequestParam(defaultValue = "1") int page) {
        Page<PostResponse> posts = postService.getPostsByViews(page - 1);
        return ResponseEntity.ok(posts);
    }

    // 전체 게시물 조회 - 좋아요 순 정렬
    @GetMapping("/by-likes")
    public ResponseEntity<Page<PostResponse>> getPostsByLikes(
            @RequestParam(defaultValue = "1") int page) {
        Page<PostResponse> posts = postService.getPostsByLikes(page - 1);
        return ResponseEntity.ok(posts);
    }


}
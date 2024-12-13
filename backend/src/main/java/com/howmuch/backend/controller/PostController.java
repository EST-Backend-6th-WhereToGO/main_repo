package com.howmuch.backend.controller;


import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor

public class PostController {

    private final PostService postService;

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

//    // 게시글 단건 조회
//    @GetMapping("/{postId}")
//    public ResponseEntity<PostResponse> getPostId(@PathVariable Long postId) {
//        postService.incrementViewCount(postId);  // 조회수 증가
//        PostResponse posts = postService.getPostById(postId);
//        return ResponseEntity.ok(posts);
//    }


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

    // 좋아요 순 인기게시물 조회
    @GetMapping("/by-likes")
    public ResponseEntity<List<Post>> getAllPostsByLikeCount() {
        List<Post> popularPosts = postService.getAllPostsByLikeCount();
        return ResponseEntity.ok(popularPosts);
    }


    // 조회수 인기게시물 조회
    @GetMapping("/by-views")
    public ResponseEntity<List<Post>> getAllPostsByViewCount() {
        List<Post> popularPosts = postService.getAllPostsByViewCount();
        return ResponseEntity.ok(popularPosts);
    }
}
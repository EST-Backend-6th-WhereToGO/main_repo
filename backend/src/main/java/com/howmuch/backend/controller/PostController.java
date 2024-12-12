package com.howmuch.backend.controller;

import com.howmuch.backend.entity.community.Post;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
public class PostController {
//    private final PostService postService;
//
//    public PostController(PostService postService) {
//        this.postService = postService;
//    }
//
//    @PostMapping
//    public ResponseEntity<Post> createPosts(@RequestBody AddPostRequest addPostRequest) {
//        Post post = postService.createPost(addPostRequest);
//        return ResponseEntity.ok(post);
//    }
//
//    @GetMapping
//    public ResponseEntity<Page<Post>> getVisiblePosts(@RequestParam(defaultValue = "0") int page) {
//        Page<Post> posts = postService.getVisiblePosts(page);
//        return ResponseEntity.ok(posts);
//    }
}
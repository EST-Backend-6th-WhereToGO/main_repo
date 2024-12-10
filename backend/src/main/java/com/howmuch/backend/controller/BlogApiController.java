package com.howmuch.backend.controller;

import com.howmuch.backend.service.BlogApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/search")
public class BlogApiController {

    private final BlogApiService blogApiService;

    public BlogApiController(BlogApiService blogApiService) {
        this.blogApiService = blogApiService;
    }

    @GetMapping
    public ResponseEntity<?> searchBlog(@RequestParam("query") String query) {
        try {
            List<Map<String, String>> response = blogApiService.searchBlog(query);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("오류 발생: " + e.getMessage());
        }
    }
}

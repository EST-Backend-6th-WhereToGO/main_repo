package com.howmuch.backend.controller;

import com.howmuch.backend.entity.DTO.PostResponse;
import com.howmuch.backend.service.PostService;
import com.howmuch.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final PostService postService;
    private final UserService userService;

    // 내 일정 조회
    @GetMapping
    public ResponseEntity<Page<PostResponse>> getMyPosts(
            OAuth2AuthenticationToken authentication,
            @RequestParam(defaultValue = "0") int page) {

        String email = authentication.getPrincipal().getAttribute("email");
        Long sessionUserId = userService.getUserIdByEmail(email);
        Page<PostResponse> posts = postService.getUserPosts(sessionUserId, page);
        return ResponseEntity.ok(posts);
    }

    // 내 일정 수정
    @PutMapping("/{planId}")
    public ResponseEntity<?> updateMyPlan(@PathVariable Long planId, @RequestBody Object updateRequest) {
        // TODO: 내 일정 수정 로직 추가
        return ResponseEntity.ok("내 일정 수정 완료");
    }

    // 내 일정 공개/비공개
    @PostMapping("/{planId}/toggle-visibility")
    public ResponseEntity<?> togglePlanVisibility(@PathVariable Long planId) {
        // TODO: 공개/비공개 전환 로직 추가 (게시판 글 삭제??)
        if (true) {
            return ResponseEntity.ok("내 일정 공개 설정 완료");
        } else {
            return ResponseEntity.ok("내 일정 비공개 설정 완료");
        }

    }

    // 내 일정 삭제
    @DeleteMapping("/{planId}")
    public ResponseEntity<?> deleteMyPlan(@PathVariable Long planId) {
        // TODO: 내 일정 삭제 로직 추가
        return ResponseEntity.ok("내 일정 삭제 완료");
    }

    // 회원정보 수정
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Object updateRequest) {
        // TODO: 회원정보 수정 로직 추가
        return ResponseEntity.ok("회원정보 수정 완료");
    }

}

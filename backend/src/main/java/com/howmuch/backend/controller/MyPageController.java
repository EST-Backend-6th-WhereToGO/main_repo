package com.howmuch.backend.controller;

import com.howmuch.backend.entity.DTO.DetailPlanDTO;
import com.howmuch.backend.entity.DTO.PlanResponse;
import com.howmuch.backend.entity.DTO.PostResponse;
import com.howmuch.backend.entity.DTO.UpdatePostRequest;
import com.howmuch.backend.entity.plan.DetailPlan;
import com.howmuch.backend.service.MyPlanService;
import com.howmuch.backend.service.PostService;
import com.howmuch.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final PostService postService;
    private final UserService userService;
    private final MyPlanService planService;

    // 내 일정 조회
    // TIP 게시글 조회 (현재 사용자)
    @GetMapping("/tip")
    public ResponseEntity<Page<PostResponse>> getTipPosts(
            OAuth2AuthenticationToken authentication,
            @RequestParam(defaultValue = "0") int page) {
        String email = authentication.getPrincipal().getAttribute("email");
        Long sessionUserId = userService.getUserIdByEmail(email);
        Page<PostResponse> posts = postService.getTipPostsByUser(sessionUserId, page);
        return ResponseEntity.ok(posts);
    }

    // TRIP 게시글 조회 (현재 사용자)
    @GetMapping("/trip")
    public ResponseEntity<Page<PostResponse>> getTripPosts(
            OAuth2AuthenticationToken authentication,
            @RequestParam(defaultValue = "0") int page) {
        String email = authentication.getPrincipal().getAttribute("email");
        Long sessionUserId = userService.getUserIdByEmail(email);
        Page<PostResponse> posts = postService.getTripPostsByUser(sessionUserId, page);
        return ResponseEntity.ok(posts);
    }

    // 내 일정 수정
    @PutMapping("/post/{postId}/plan")
    public ResponseEntity<?> updatePlan(
            OAuth2AuthenticationToken authentication,
            @PathVariable Long postId,
            @RequestBody PlanResponse planResponse) { // Request와 형태가 같아서 Response 재사용

        String email = authentication.getPrincipal().getAttribute("email");
        Long sessionUserId = userService.getUserIdByEmail(email);

        return ResponseEntity.ok("Plan 업데이트 완료");
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<PostResponse> getEditablePost(
            OAuth2AuthenticationToken authentication,
            @PathVariable Long postId) {
        String email = authentication.getPrincipal().getAttribute("email");
        Long sessionUserId = userService.getUserIdByEmail(email);

        PostResponse post = postService.getEditablePost(postId, sessionUserId);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/post/{postId}/plan")
    public ResponseEntity<PlanResponse> getPlanByPost(
            OAuth2AuthenticationToken authentication,
            @PathVariable Long postId) {
        String email = authentication.getPrincipal().getAttribute("email");
        Long sessionUserId = userService.getUserIdByEmail(email);

        PlanResponse plan = postService.getPlanByPostId(postId, sessionUserId);
        return ResponseEntity.ok(plan);
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

    @GetMapping("/plan/{planId}/details")
    public ResponseEntity<List<DetailPlanDTO>> getDetailPlans(@PathVariable Long planId) {
        List<DetailPlanDTO> details = planService.getDetailsByPlanId(planId);
        return ResponseEntity.ok(details);
    }
}

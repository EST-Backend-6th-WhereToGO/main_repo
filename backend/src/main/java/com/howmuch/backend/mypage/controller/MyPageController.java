package com.howmuch.backend.mypage.controller;

import org.hibernate.jdbc.Expectation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/my-plans")
public class MyPageController {

    // 내 일정 조회
    @GetMapping
    public ResponseEntity<?> getMyPlans() {
        // TODO: 내 일정 조회 로직 추가
        return ResponseEntity.ok("내 일정 조회");
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

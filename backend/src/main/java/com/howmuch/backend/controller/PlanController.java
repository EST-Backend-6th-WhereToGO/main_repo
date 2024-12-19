package com.howmuch.backend.controller;

import java.util.Map;

import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.service.PlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plan")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping("/{planId}")
    public ResponseEntity<?> getPlanById(@PathVariable Long planId) {
        try {
            Plan plan = planService.getPlanById(planId);

            // 필요한 데이터만 추출하여 클라이언트에 반환
            return ResponseEntity.ok(
                Map.of(
                    "planId", plan.getPlanId(),
                    "userId", plan.getUser().getUserId(),
                    "city", Map.of(
                        "id", plan.getCity().getCityId(),
                        "name", plan.getCity().getCityName()
                    ),
                    "startDate", plan.getStartAt().toLocalDate(),
                    "endDate", plan.getEndAt().toLocalDate()
                )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

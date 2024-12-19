package com.howmuch.backend.entity.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class PlanResponse {
    private Long planId;
    private String cityName;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private boolean isPublic;

    public PlanResponse(Long planId, String cityName, LocalDateTime startAt, LocalDateTime endAt, boolean isPublic) {
        this.planId = planId;
        this.cityName = cityName;
        this.startAt = startAt;
        this.endAt = endAt;
        this.isPublic = isPublic;
    }

}

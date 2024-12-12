package com.howmuch.backend.entity.dto;

import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
@Setter
public class SavePlanDTO {
    private User user;
    private City selectedCity;
    private LocalDate startedAt;
    private LocalDate endedAt;
    private boolean isPublic;

    private String aiRequest;

    public SavePlanDTO(PlanRequest planRequest, City selectedCity, User testUser) {
        this.user = testUser;
        this.selectedCity = selectedCity;
        this.startedAt = planRequest.getStartedAt();
        this.endedAt = planRequest.getEndedAt();
        this.isPublic = true;
    }
}

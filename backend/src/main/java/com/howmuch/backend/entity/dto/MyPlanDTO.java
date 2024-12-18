package com.howmuch.backend.entity.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import static com.howmuch.backend.util.DateFormatUtil.formatter;

@NoArgsConstructor
@Getter
@Setter
public class MyPlanDTO {
    private Long userId;
    private Long cityId;
    private String startedAt;
    private String endedAt;
    private boolean isPublic;

    private String aiRequest;
    private List<MyTripOrder> myTripOrderList;
    private String cityName;

    public MyPlanDTO(com.howmuch.backend.entity.DTO.PlanRequest planRequest, Long cityId, Long userId) {
        this.userId = userId;
        this.cityId = cityId;
        this.startedAt = planRequest.getStartedAt().format(formatter);
        this.endedAt = planRequest.getEndedAt().format(formatter);
        this.isPublic = true;
        this.cityName = planRequest.getCity();
    }
}

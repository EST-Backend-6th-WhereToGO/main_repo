package com.howmuch.backend.entity.DTO;

import com.howmuch.backend.entity.plan.DetailPlan;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DetailPlanDTO {
    private Long detailPlanId;
    private String placeName;
    private Long planId;
    private int day;
    private String startTime;

    public DetailPlanDTO(DetailPlan detailPlan) {
        this.detailPlanId = detailPlan.getDetailPlanId();
        this.placeName = detailPlan.getPlaceName();
        this.day = detailPlan.getDay();
        this.planId = detailPlan.getPlan().getPlanId();
        this.startTime = detailPlan.getStartTime();
    }
}

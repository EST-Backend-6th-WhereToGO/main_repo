package com.howmuch.backend.entity.plan;

import jakarta.persistence.*;

@Entity
public class DetailPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detailPlanId;

    @ManyToOne
    @JoinColumn(name="plan_id")
    private Plan plan;

    @Column(name="day", nullable = false)
    private int day;

    @Column(name="sequence", nullable = false)
    private int sequence;

    @Column(name="place_name", nullable = false)
    private String placeName;

    @Column(name="place_img", nullable = false)
    private String placeImg;

    @Column(name="start_time", nullable = false)
    private String startTime;  // 해당 장소에서의 시작 시간

    @Column(name="end_time", nullable = false)
    private String endTime;    // 해당 장소에서의 종료 시간
}

package com.howmuch.backend.entity;

import jakarta.persistence.*;

@Entity
public class DetailPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detail_plan_id;

    @ManyToOne
    @JoinColumn(name="plan_id")
    private Plan plan;

    @Column(name="day")
    private int day;

    @Column(name="order")
    private int order;

    @Column(name="place_name")
    private String place_name;

    @Column(name="place_img")
    private String place_img;

    @Column(name="start_time")
    private String start_time;  // 해당 장소에서의 시작 시간

    @Column(name="end_time")
    private String end_time;    // 해당 장소에서의 종료 시간
}

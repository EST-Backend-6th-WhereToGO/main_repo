package com.howmuch.backend.entity.plan;

import jakarta.persistence.*;

@Entity
@Table(name="detail_plan")
public class DetailPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="detail_plan_id")
    private Long detail_plan_id;

    @ManyToOne
    @JoinColumn(name="plan_id")
    private Plan plan;

    @Column(name="day", nullable = false)
    private int day;

    @Column(name="sequence", nullable = false)
    private int sequence;

    @Column(name="place_name", nullable = false)
    private String place_name;

    @Column(name="place_img", nullable = false)
    private String place_img;

    @Column(name="start_time", nullable = false)
    private String start_time;  // 해당 장소에서의 시작 시간

    @Column(name="end_time", nullable = false)
    private String end_time;    // 해당 장소에서의 종료 시간
}

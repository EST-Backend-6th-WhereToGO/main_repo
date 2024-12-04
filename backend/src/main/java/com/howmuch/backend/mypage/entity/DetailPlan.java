package com.howmuch.backend.mypage.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "detail_plan")
public class DetailPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detailPlanId;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Column(nullable = false)
    private Integer day;

    @Column(name = "order", nullable = false)
    private Integer order;

    @Column(name = "place_name", nullable = false)
    private String placeName;

    @Column(name = "place_img")
    private String placeImg;

    @Column(name = "start_time", nullable = false)
    private String startTime;

    @Column(name = "end_time", nullable = false)
    private String endTime;
}

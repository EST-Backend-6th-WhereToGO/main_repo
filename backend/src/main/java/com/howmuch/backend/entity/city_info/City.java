package com.howmuch.backend.entity.city_info;

import com.howmuch.backend.entity.plan.Plan;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "city")
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private Long city_id;

    @ManyToOne
    @JoinColumn(name="category_id")
    private Category category;

    @Column(name="domestic", nullable = false)
    private boolean isDomestic;

    @Column(name="city_name", nullable = false)
    private String city_name;

    @Column(name="description")
    private String description; // 설명

    private String photo;  // 이미지 파일 저장 경로

    private int flight_time; // 비행시간(분단위로 저장)

    private String visa_info; // 비자정보

    private String currency; // 통화

    private String time_diff; // 시차

    private String language; // 언어

    private String weather; // 추천계절

    private String clothes; // 추천옷차림

    private String period; // 추천 여행 기간

    private String expense; // 예상경비

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "city")
    private List<Plan> planList;
}

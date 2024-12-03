package com.howmuch.backend.entity;

import jakarta.persistence.*;

import java.sql.Time;

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

    @Column(name="domestic")
    private boolean isDomestic;

    @Column(name="city_name")
    private String city_name;

    private String explain; // 설명

    private String photo;

    private Time flight_time; // 비행시간

    private String visa_info; // 비자정보

    private String currency; // 통화

    private String time_diff; // 시차

    private String language; // 언어

    private String weather; // 추천계절

    private String clothes; // 추천옷차림

    private String period; // 추천 여행 기간

    private String expense; // 예상경비
}

package com.howmuch.backend.entity.city_info;

import com.howmuch.backend.entity.plan.Plan;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Data
@Entity
@Table(name = "city")
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")

    private Long cityId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "domestic", nullable = false)
    private boolean domestic; // Camel Case로 변경

    @Column(name="city_name", nullable = false)
    private String cityName;

    @Column(name = "description")
    private String description;

    private String photo;


    @Column(name = "flight_time")
    private int flightTime; // Camel Case로 변경

    @Column(name = "visa_info")
    private String visaInfo; // Camel Case로 변경

    private String currency;

    @Column(name = "time_diff")
    private String timeDiff; // Camel Case로 변경


    private String language;

    private String weather;

    private String clothes;

    private String period;

    private String expense;

    @Column(name = "eng_city_name")
    private String engCityName; // Camel Case 유지

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "city")
    private List<Plan> planList;
}

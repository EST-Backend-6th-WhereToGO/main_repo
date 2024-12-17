package com.howmuch.backend.entity.plan;

import com.howmuch.backend.entity.DTO.MyTripOrder;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Entity
@Table(name="detail_plan")
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

    @Column(name="place_img")
    private String placeImg;

    @Column(name="start_time", nullable = false)
    private String startTime;  // 해당 장소에서의 시작 시간

    @Column(name="end_time")
    private String endTime;    // 해당 장소에서의 종료 시간

    public DetailPlan(Plan plan, MyTripOrder myTripOrder) {
        this.plan = plan;
        this.day = Integer.parseInt(myTripOrder.getDay());
        this.sequence = Integer.parseInt(myTripOrder.getOrder());
        this.placeName = myTripOrder.getPlace();
        this.startTime = myTripOrder.getTime();
    }
}

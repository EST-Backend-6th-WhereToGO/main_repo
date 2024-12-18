package com.howmuch.backend.entity.plan;

import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.DTO.MyPlanDTO;
import com.howmuch.backend.entity.user.User;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@Table(name = "plan")
@Getter
@Setter
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long planId;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="city_id")
    private City city;

    @Column(name = "public", nullable = false)
    private boolean isPublic;

    @Column(name="start_at", nullable = false)
    private LocalDateTime startAt;  // 전체 일정 시작

    @Column(name="end_at", nullable = false)
    private LocalDateTime endAt;    // 전체 일정 종료

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "plan")
    private List<DetailPlan> detailPlans;

    public Plan(MyPlanDTO myPlanDTO, User user, City city) {
        this.user = user;
        this.city = city;
        this.isPublic=true;

        LocalDate start = LocalDate.parse(myPlanDTO.getStartedAt(), DateTimeFormatter.ISO_DATE);
        this.startAt = start.atStartOfDay();
        LocalDate end = LocalDate.parse(myPlanDTO.getEndedAt(), DateTimeFormatter.ISO_DATE);
        this.endAt = end.atStartOfDay();
    }
}

package com.howmuch.backend.entity.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.entity.community.Post;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "user")
@Data
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name ="email", nullable = false)
    private String email;

    @Column(name ="nickname", nullable = false)  // 비지니스 로직에서 중복 검사 필요
    private String nickname;

    @Column(name ="gender", nullable = false)
    private String gender;

    @Column(name ="age", nullable = false)
    private int age;

    @Column(name ="city", nullable = false)
    private String city;

    @Column(name ="region", nullable = false)
    private String region;

    @Column(name ="mbti", nullable = false)
    private String mbti;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name ="token", nullable = false)
    private String token;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
    private List<Post> postList;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
    private List<Plan> planList;

}

package com.howmuch.backend.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long user_id;

    @Column(name ="email", nullable = false)
    private String email;

    @Column(name ="nickname", nullable = false)
    private String nickname;

    @Column(name ="gender")
    private String gender;

    @Column(name ="age", nullable = false)
    private int age;

    @Column(name ="city")
    private String city;

    @Column(name ="region")
    private String region;

    @Column(name ="mbti")
    private String mbti;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @Column(name ="token", nullable = false)
    private String token;

}

package com.howmuch.backend.entity.community;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "post_like")
public class PostLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

    @ManyToOne
    @JoinColumn(name="post_id")
    private Post post;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;


    protected PostLike() {}

    public PostLike(Post post, Long userId) {
        this.post = post;
        this.userId = userId;
    }
}
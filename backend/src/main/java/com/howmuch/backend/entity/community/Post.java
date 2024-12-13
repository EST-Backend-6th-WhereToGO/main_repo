package com.howmuch.backend.entity.community;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "post")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @Enumerated(EnumType.STRING)
    @Column(name ="header", nullable = false)
    private PostHeader header;

    @Column(name ="title", nullable = false)
    private String title;

    @Column(name="content")
    private String content;

    @Column(name="like_count", nullable = false)
    private Long likeCount;

    @Column(name="view_count", nullable = false)
    private Long viewCount;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "post")
    private List<PostLike> postLikes;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "post")
    private List<PostComment> postComments;
}

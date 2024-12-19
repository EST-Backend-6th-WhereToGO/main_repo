package com.howmuch.backend.entity.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PostResponse {

    private Long postId;
    private Long userId;
    private Long planId;
    private String title;
    private String header;
    private String content;
    private String nickname;
    private Long likeCount;
    private Long viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

package com.howmuch.backend.entity.dto;

import com.howmuch.backend.entity.community.PostHeader;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddPostRequest {
    private PostHeader header;
    private String title;
    private String content;
    private Long planId;
}

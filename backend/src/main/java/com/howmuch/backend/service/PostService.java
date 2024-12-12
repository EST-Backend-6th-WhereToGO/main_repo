package com.howmuch.backend.service;

import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.community.PostHeader;
import com.howmuch.backend.entity.dto.AddPostRequest;
import com.howmuch.backend.entity.dto.UpdatePostRequest;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.repository.PlanRepository;
import com.howmuch.backend.repository.PostRepository;
import com.howmuch.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final PlanRepository planRepository;
    private static final int PAGE_SIZE = 20;

    public PostService(PostRepository postRepository, UserRepository userRepository, PlanRepository planRepository) {
        this.postRepository = postRepository;
        this.planRepository = planRepository;
    }

    public Post createPost(AddPostRequest addPostRequest) {
        if(addPostRequest.getHeader() == PostHeader.TIP) {
            return createTipPost(addPostRequest);
        } else if (addPostRequest.getHeader() == PostHeader.TRIP) {
            return createTripPost(addPostRequest);
        } else {
            throw new IllegalArgumentException("유효하지 않은 헤더");
        }
    }

    public Post createTipPost(AddPostRequest addPostRequest) {

        Post post = Post.builder()
                .header(PostHeader.TIP)
                .title(addPostRequest.getTitle())
                .content(addPostRequest.getContent())
                .likeCount(0L)
                .viewCount(0L)
                .build();
        return postRepository.save(post);
    }

    public Post createTripPost(AddPostRequest addPostRequest) {
        Plan plan = planRepository.findById(addPostRequest.getPlanId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 PlanId"));

        Post post = Post.builder()
                .header(PostHeader.TRIP)
                .title(addPostRequest.getTitle())
                .content(addPostRequest.getContent())
                .plan(plan)
                .likeCount(0L)
                .viewCount(0L)
                .build();
        return postRepository.save(post);
    }

    public Page<Post> getPostsByHeader(String header, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());

        if(header.equals(PostHeader.TIP.name())) {
            return postRepository.findTipPosts(pageable);
        } else if(header.equals(PostHeader.TRIP.name())) {
            return postRepository.findTripPosts(pageable);
        } else {
            throw new IllegalArgumentException("유효하지 않은 헤더입니다");
        }
    }

    public Page<Post> getVisiblePosts(int page) {
        Pageable pageable = PageRequest.of(page,PAGE_SIZE, Sort.by("createdAt").descending());
        return postRepository.findVisiblePosts(pageable);
    }

    public Post getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다"));

        if (post.getHeader() == PostHeader.TRIP && (post.getPlan() == null || !post.getPlan().isPublic())) {
            throw new IllegalArgumentException("공개 게시글이 아닙니다.");
        }
        return post;
    }

    public void deletePostById(Long postId, Long sessionUserId) {
        Post post = postRepository.findById(postId)
               .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다"));

//        if(!post.getUser().getUserId().equals(sessionUserId)) {    // 로그인아이디 != 세션아이디 일시 삭제 권한X
//            throw new IllegalArgumentException("삭제 권한이 없습니다"); // IllegalArgumentException이 맞는지
//        }

        postRepository.deleteById(postId);
    }

    public Post updatePost(Long postId, Long sessionUserId, UpdatePostRequest updatePostRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(()-> new IllegalArgumentException("게스글을 찾을 수 없습니다"));

//        if(!post.getUser().getUserId().equals(sessionUserId)) {
//            throw new IllegalArgumentException("수정 권한이 없습니다");
//        }
        post.setTitle(updatePostRequest.getTitle());
        post.setContent(updatePostRequest.getContent());

        return postRepository.save(post);
    }




}

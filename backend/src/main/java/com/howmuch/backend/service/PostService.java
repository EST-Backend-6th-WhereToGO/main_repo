package com.howmuch.backend.service;


import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.community.PostLike;
import com.howmuch.backend.entity.community.PostHeader;
import com.howmuch.backend.entity.DTO.AddPostRequest;
import com.howmuch.backend.entity.DTO.PostResponse;
import com.howmuch.backend.entity.DTO.UpdatePostRequest;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.PlanRepository;
import com.howmuch.backend.repository.PostRepository;
import com.howmuch.backend.repository.UserRepository;
import com.howmuch.backend.repository.PostLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Component
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;
    private static final int PAGE_SIZE = 20;

    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository, PlanRepository planRepository, PostLikeRepository postLikeRepository) {
        this.postRepository = postRepository;
        this.planRepository = planRepository;
        this.userRepository = userRepository;
        this.postLikeRepository = postLikeRepository;
    }


    public PostResponse createPost(AddPostRequest addPostRequest, Long sessionUserId) {
        User user = userRepository.findById(sessionUserId)
                .orElseThrow(()->new IllegalArgumentException("유효하지 않은 User"));

        Plan plan = null;
        if (addPostRequest.getHeader() == PostHeader.TRIP) {
            plan = planRepository.findById(addPostRequest.getPlanId())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 PlanId"));
        }

        // Post 객체 생성
        Post post = Post.builder()
                .header(addPostRequest.getHeader())
                .title(addPostRequest.getTitle())
                .content(addPostRequest.getContent())
                .user(user) // 작성자 설정
                .plan(plan) // TRIP일 경우만 설정
                .likeCount(0L)
                .viewCount(0L)
                .build();
        post = postRepository.save(post);
        return toPostResponse(post);
    }


    public Page<PostResponse> getPostsByHeader(String header, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());
        Page<Post> posts;

        if (header.toUpperCase().equals(PostHeader.TIP.name())) {
            posts = postRepository.findTipPosts(pageable);
        } else if (header.toUpperCase().equals(PostHeader.TRIP.name())) {
            posts = postRepository.findTripPosts(pageable);
        } else {
            throw new IllegalArgumentException("유효하지 않은 헤더입니다");
        }
        return posts.map(this::toPostResponse);
    }

    public Page<PostResponse> getVisiblePosts(int page) {
        Pageable pageable = PageRequest.of(page,PAGE_SIZE, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findVisiblePosts(pageable);
        return posts.map(this::toPostResponse);
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (post.getHeader() == PostHeader.TRIP && (post.getPlan() == null || !post.getPlan().isPublic())) {
            throw new IllegalArgumentException("공개 게시글이 아닙니다.");
        }

        return toPostResponse(post);
    }

    public void deletePostById(Long postId, Long sessionUserId) {
        Post post = postRepository.findById(postId)
               .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다"));

        if(!post.getUser().getUserId().equals(sessionUserId)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다");
        }

        postRepository.deleteById(postId);
    }

    public PostResponse updatePost(Long postId, String email, UpdatePostRequest updatePostRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("유효하지 않은 이메일입니다"));

        Post post = postRepository.findById(postId)
                .orElseThrow(()-> new IllegalArgumentException("게시글을 찾을 수 없습니다"));

        if(!post.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("수정 권한이 없습니다");
        }
        post.setTitle(updatePostRequest.getTitle());
        post.setContent(updatePostRequest.getContent());

        post = postRepository.save(post);

        return toPostResponse(post);
    }

    private PostResponse toPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setPostId(post.getPostId());
        response.setUserId(post.getUser().getUserId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setNickname(post.getUser().getNickname());
        response.setLikeCount(post.getLikeCount());
        response.setViewCount(post.getViewCount());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());

        return response;
    }
  
   // 좋아요 등록
    @Transactional
    public void likePost(Long postId, Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        postLikeRepository.findByPost_PostIdAndUserId(postId, userId)
                .ifPresent(like -> {
                    throw new IllegalArgumentException("이미 좋아요를 눌렀습니다.");

                });
        PostLike postLike = new PostLike(post, userId);
        postLikeRepository.save(postLike);

        post.incrementLikeCount();
        postRepository.save(post);
    }

    // 좋아요 취소
    @Transactional
    public void unlikePost(Long postId, Long userId) {

        PostLike postLike = postLikeRepository.findByPost_PostIdAndUserId(postId, userId)
                .orElseThrow(() -> new IllegalArgumentException("좋아요 기록이 존재하지 않습니다."));

        Post post = postLike.getPost();
        postLikeRepository.delete(postLike);

        post.decrementLikeCount();
        postRepository.save(post);
    }

    // 게시물 좋아요 순 조회
    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPostsByLikeCount(int page) {
        Pageable pageable = PageRequest.of(page,PAGE_SIZE);
        Page<Post> posts = postRepository.findAllByOrderByLikeCountDesc(pageable);
        return posts.map(this::toPostResponse);
    }

    // 게시물 조회수 순 조회
    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPostsByViewCount(int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        Page<Post> posts =  postRepository.findAllByOrderByViewCountDesc(pageable);
        return posts.map(this::toPostResponse);
    }

    // 게시물 조회수 증가
    @Transactional
    public void incrementViewCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        post.setViewCount(post.getViewCount() + 1);
    }

    public boolean isPostLikedByUser(Long postId, Long userId) {
        return postLikeRepository.findByPost_PostIdAndUserId(postId, userId).isPresent();
    }
}
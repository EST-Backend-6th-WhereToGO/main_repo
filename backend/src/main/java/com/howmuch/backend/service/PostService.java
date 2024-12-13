package com.howmuch.backend.service;

import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.community.PostHeader;
import com.howmuch.backend.entity.dto.AddPostRequest;
import com.howmuch.backend.entity.dto.PostResponse;
import com.howmuch.backend.entity.dto.UpdatePostRequest;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.PlanRepository;
import com.howmuch.backend.repository.PostRepository;
import com.howmuch.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PostService {
    private final PostRepository postRepository;
    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private static final int PAGE_SIZE = 20;

    public PostService(PostRepository postRepository, UserRepository userRepository, PlanRepository planRepository) {
        this.postRepository = postRepository;
        this.planRepository = planRepository;
        this.userRepository = userRepository;
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

        if(header.equals(PostHeader.TIP.name())) {
            posts = postRepository.findTipPosts(pageable);
        } else if(header.equals(PostHeader.TRIP.name())) {
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

    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다"));

        if (post.getHeader() == PostHeader.TRIP && (post.getPlan() == null || !post.getPlan().isPublic())) {
            throw new IllegalArgumentException("공개 게시글이 아닙니다.");
        }
        return toPostResponse(post);
    }

    public void deletePostById(Long postId, Long sessionUserId) {
        Post post = postRepository.findById(postId)
               .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다"));

//        if(!post.getUser().getUserId().equals(sessionUserId)) {    // 로그인아이디 != 세션아이디 일시 삭제 권한X
//            throw new IllegalArgumentException("삭제 권한이 없습니다"); // IllegalArgumentException이 맞는지
//        }

        postRepository.deleteById(postId);
    }

    public PostResponse updatePost(Long postId, Long sessionUserId, UpdatePostRequest updatePostRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(()-> new IllegalArgumentException("게시글을 찾을 수 없습니다"));

//        if(!post.getUser().getUserId().equals(sessionUserId)) {
//            throw new IllegalArgumentException("수정 권한이 없습니다");
//        }
        post.setTitle(updatePostRequest.getTitle());
        post.setContent(updatePostRequest.getContent());

        post = postRepository.save(post);

        return toPostResponse(post);
    }

    private PostResponse toPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setPostId(post.getPostId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setNickname(post.getUser().getNickname());
        response.setLikeCount(post.getLikeCount());
        response.setViewCount(post.getViewCount());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());

        return response;
    }
}
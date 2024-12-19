package com.howmuch.backend.service;

import com.howmuch.backend.entity.DTO.*;
import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.community.PostHeader;
import com.howmuch.backend.entity.plan.DetailPlan;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class MyPlanService {

    private final PlanRepository planRepository;
    private final DetailPlanRepository detailPlanRepository;
    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final PostService postService;
    private final PostRepository postRepository;

    public MyPlanService(PlanRepository planRepository
            , DetailPlanRepository detailPlanRepository
            , UserRepository userRepository
            , CityRepository cityRepository
            , PostService postService
            , PostRepository postRepository) {
        this.planRepository = planRepository;
        this.detailPlanRepository = detailPlanRepository;
        this.userRepository = userRepository;
        this.cityRepository = cityRepository;
        this.postService = postService;
        this.postRepository = postRepository;
    }

    public Plan savePlan(MyPlanDTO myPlanDTO) {
        User user = userRepository.findById(myPlanDTO.getUserId()).orElseThrow(IllegalArgumentException::new);
        City city = cityRepository.findById(myPlanDTO.getCityId()).orElseThrow(IllegalArgumentException::new);


        Plan plan = planRepository.save(new Plan(myPlanDTO, user, city));

        AddPostRequest addPostRequest = new AddPostRequest();
        addPostRequest.setHeader(PostHeader.TRIP);
        addPostRequest.setTitle(city.getCityName() + " 여행");
        addPostRequest.setContent("여행 일정");
        addPostRequest.setPlanId(plan.getPlanId());

        postService.createPost(addPostRequest, user.getUserId());
        return plan;
    }

    @Transactional
    public Plan updatePlanAndDetails(MyPlanDTO myPlanDTO) {
        // 기존 Plan 가져오기
        Plan existingPlan = planRepository.findById(myPlanDTO.getPlanId())
            .orElseThrow(() -> new IllegalArgumentException("Plan을 찾을 수 없습니다."));

        // City 정보 가져오기
        City city = cityRepository.findById(myPlanDTO.getCityId())
            .orElseThrow(() -> new IllegalArgumentException("도시를 찾을 수 없습니다."));

        // String -> LocalDateTime 변환
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        LocalDateTime startAt = LocalDate.parse(myPlanDTO.getStartedAt(), formatter).atStartOfDay();
        LocalDateTime endAt = LocalDate.parse(myPlanDTO.getEndedAt(), formatter).atStartOfDay();

        // Plan 업데이트
        existingPlan.setCity(city);
        existingPlan.setStartAt(startAt);
        existingPlan.setEndAt(endAt);

        // DetailPlan 삭제
        detailPlanRepository.deleteByPlan(existingPlan);

        // 새 DetailPlan 저장
        saveDetailPlan(existingPlan, myPlanDTO.getMyTripOrderList());

        return planRepository.save(existingPlan);
    }

    public void saveDetailPlan(Plan plan, List<MyTripOrder> myTripOrderList) {
        List<DetailPlan> detailPlanList = new ArrayList<>();

        for (MyTripOrder myTripOrder : myTripOrderList) {
            DetailPlan detailPlan = new DetailPlan(plan, myTripOrder);
            detailPlanList.add(detailPlan);
        }

        detailPlanRepository.saveAll(detailPlanList);
    }

    @Transactional
    public void updatePlanByPostId(Long postId, Long userId, PlanResponse planResponse) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));

        if (!post.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 게시물만 수정 가능합니다.");
        }

        Plan plan = post.getPlan();
        if (plan == null) {
            throw new IllegalArgumentException("해당 게시물에 연결된 Plan이 없습니다.");
        }

        City newCity = cityRepository.findByCityName(planResponse.getCityName())
                .orElseThrow(() -> new IllegalArgumentException("해당 도시를 찾을 수 없습니다."));

        plan.setCity(newCity);

        plan.setStartAt(planResponse.getStartAt()); // 시작 날짜
        plan.setEndAt(planResponse.getEndAt());     // 종료 날짜

        planRepository.save(plan);
    }

    public List<DetailPlanDTO> getDetailsByPlanId(Long planId) {
        List<DetailPlan> details = detailPlanRepository.findByPlan_PlanId(planId);

        return details.stream()
                .map(DetailPlanDTO::new)
                .toList();
    }


}

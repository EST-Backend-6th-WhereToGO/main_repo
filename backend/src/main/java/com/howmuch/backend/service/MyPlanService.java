package com.howmuch.backend.service;

import com.howmuch.backend.entity.DTO.AddPostRequest;
import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.DTO.MyPlanDTO;
import com.howmuch.backend.entity.DTO.MyTripOrder;
import com.howmuch.backend.entity.community.PostHeader;
import com.howmuch.backend.entity.plan.DetailPlan;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.repository.CityRepository;
import com.howmuch.backend.repository.DetailPlanRepository;
import com.howmuch.backend.repository.PlanRepository;
import com.howmuch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MyPlanService {

    private final PlanRepository planRepository;
    private final DetailPlanRepository detailPlanRepository;
    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final PostService postService;

    public MyPlanService(PlanRepository planRepository
            , DetailPlanRepository detailPlanRepository
            , UserRepository userRepository
            , CityRepository cityRepository
            , PostService postService) {
        this.planRepository = planRepository;
        this.detailPlanRepository = detailPlanRepository;
        this.userRepository = userRepository;
        this.cityRepository=cityRepository;
        this.postService=postService;
    }

    public Plan savePlan(MyPlanDTO myPlanDTO) {
        User user = userRepository.findById(myPlanDTO.getUserId()).orElseThrow(IllegalArgumentException::new);
        City city = cityRepository.findById(myPlanDTO.getCityId()).orElseThrow(IllegalArgumentException::new);


        Plan plan =  planRepository.save(new Plan(myPlanDTO, user, city));

        AddPostRequest addPostRequest = new AddPostRequest();
        addPostRequest.setHeader(PostHeader.TRIP);
        addPostRequest.setTitle(city.getCityName() + " 여행");
        addPostRequest.setContent("여행 일정");
        addPostRequest.setPlanId(plan.getPlanId());

        postService.createPost(addPostRequest, user.getUserId());
        return plan;
    }

    public void saveDetailPlan(Plan plan, List<MyTripOrder> myTripOrderList) {
        List<DetailPlan> detailPlanList = new ArrayList<>();

        for (MyTripOrder myTripOrder : myTripOrderList) {
            DetailPlan detailPlan = new DetailPlan(plan, myTripOrder);
            detailPlanList.add(detailPlan);
        }

        detailPlanRepository.saveAll(detailPlanList);
    }
}

package com.howmuch.backend.service;

import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.DTO.MyPlanDTO;
import com.howmuch.backend.entity.DTO.MyTripOrder;
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

    PlanRepository planRepository;
    DetailPlanRepository detailPlanRepository;
    UserRepository userRepository;
    CityRepository cityRepository;

    public MyPlanService(PlanRepository planRepository
            , DetailPlanRepository detailPlanRepository
            , UserRepository userRepository
            , CityRepository cityRepository) {
        this.planRepository = planRepository;
        this.detailPlanRepository = detailPlanRepository;
        this.userRepository = userRepository;
        this.cityRepository=cityRepository;
    }

    public Plan savePlan(MyPlanDTO myPlanDTO) {
        User user = userRepository.findById(myPlanDTO.getUserId()).orElseThrow(IllegalArgumentException::new);
        City city = cityRepository.findById(myPlanDTO.getCityId()).orElseThrow(IllegalArgumentException::new);

        return planRepository.save(new Plan(myPlanDTO, user, city));
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

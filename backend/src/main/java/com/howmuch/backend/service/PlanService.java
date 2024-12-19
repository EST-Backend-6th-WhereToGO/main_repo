package com.howmuch.backend.service;

import com.howmuch.backend.entity.DTO.MyPlanDTO;
import com.howmuch.backend.entity.DTO.MyTripOrder;
import com.howmuch.backend.entity.plan.DetailPlan;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.repository.DetailPlanRepository;
import com.howmuch.backend.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlanService {

	private final PlanRepository planRepository;
	private final UserService userService;
	private final CityService cityService;
	private final DetailPlanRepository detailPlanRepository;

	public PlanService(PlanRepository planRepository, UserService userService, CityService cityService, DetailPlanRepository detailPlanRepository) {
		this.planRepository = planRepository;
		this.userService = userService;
		this.cityService = cityService;
		this.detailPlanRepository = detailPlanRepository;
	}

	public Plan getPlanById(Long planId) {
		return planRepository.findById(planId)
			.orElseThrow(() -> new IllegalArgumentException("Plan not found with id: " + planId));
	}

	public Plan savePlan(MyPlanDTO myPlanDTO) {
		Plan plan = new Plan(myPlanDTO, userService.getUserById(myPlanDTO.getUserId()), cityService.getCityById(myPlanDTO.getCityId()));
		return planRepository.save(plan);
	}

	public Plan updatePlan(MyPlanDTO myPlanDTO) {
		// 기존 Plan 조회
		Plan existingPlan = planRepository.findById(myPlanDTO.getPlanId())
			.orElseThrow(() -> new IllegalArgumentException("Plan not found with ID: " + myPlanDTO.getPlanId()));

		// Plan 수정
		existingPlan.setStartAt(LocalDate.parse(myPlanDTO.getStartedAt()).atStartOfDay());
		existingPlan.setEndAt(LocalDate.parse(myPlanDTO.getEndedAt()).atStartOfDay());
		existingPlan.setCity(cityService.getCityById(myPlanDTO.getCityId()));

		return planRepository.save(existingPlan);
	}

	public void saveDetailPlan(Plan plan, List<MyTripOrder> tripOrderList) {
		// 기존 DetailPlan 삭제
		detailPlanRepository.deleteByPlan(plan);

		// 새 DetailPlan 저장
		List<DetailPlan> detailPlans = tripOrderList.stream()
			.map(order -> new DetailPlan(plan, order))
			.collect(Collectors.toList());

		detailPlanRepository.saveAll(detailPlans);
	}
}

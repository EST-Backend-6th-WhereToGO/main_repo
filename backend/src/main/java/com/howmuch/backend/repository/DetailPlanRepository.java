package com.howmuch.backend.repository;

import com.howmuch.backend.entity.plan.DetailPlan;
import com.howmuch.backend.entity.plan.Plan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

import jakarta.transaction.Transactional;

@Repository
public interface DetailPlanRepository extends JpaRepository<DetailPlan, Long> {
    List<DetailPlan> findByPlan_PlanId(Long planId);

    void deleteByPlan(Plan plan);
}

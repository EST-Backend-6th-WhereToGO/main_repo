package com.howmuch.backend.repository;

import com.howmuch.backend.entity.plan.DetailPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailPlanRepository extends JpaRepository<DetailPlan, Long> {

}

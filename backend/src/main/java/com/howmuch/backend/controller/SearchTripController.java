package com.howmuch.backend.controller;

import com.howmuch.backend.entity.DTO.MyPlanDTO;
import com.howmuch.backend.entity.plan.Plan;
import com.howmuch.backend.service.MyPlanService;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class SearchTripController {

    // 진헌 id
    // private final String CLIENT_ID = "0ad2c726-07c9-40b1-ae02-32efa5048571";
    // 5조 id
    private final String CLIENT_ID = "8bc1e7c2-e377-48ec-8476-1e66e9830533";

    MyPlanService myPlanService;

    public SearchTripController(MyPlanService myPlanService) {
        this.myPlanService = myPlanService;
    }


    @PostMapping("/searchTrip")
    public ResponseEntity<String> searchTrip(@RequestBody(required = false) MyPlanDTO myPlan) throws JSONException {

        System.out.println("myPlan : "+myPlan.getStartedAt()+ "  "+myPlan.getEndedAt());
        System.out.println("aiRequest :" +myPlan.getAiRequest());
        String aiRequest = myPlan.getAiRequest();

        String object ="";

        String requestUrl = "https://kdt-api-function.azurewebsites.net/api/v1/question?content=" +
                aiRequest +
                "&client_id=" + CLIENT_ID;
        System.out.println("requestUrl = " + requestUrl);
        try {
            object = new RestTemplate().getForObject(requestUrl, String.class);
            return ResponseEntity.ok(object);
        } catch (Exception e) {
            System.out.println("error");
            return ResponseEntity.badRequest().body("error");
        }
    }

    @PostMapping("/savePlan")
    public ResponseEntity<Void> savePlan(@RequestBody MyPlanDTO myPlan) {
        System.out.println("Received plan: " + myPlan);

        if (myPlan.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }

        if (myPlan.getCityId() == null) {
            throw new IllegalArgumentException("City ID must not be null");
        }

        Plan plan;
        if (myPlan.getPlanId() != 0) { // Plan ID가 0이 아니면 수정
            plan = myPlanService.updatePlanAndDetails(myPlan);
        } else { // Plan ID가 0이면 새로 생성
            plan = myPlanService.savePlan(myPlan);
            myPlanService.saveDetailPlan(plan, myPlan.getMyTripOrderList());
        }

        return ResponseEntity.ok().build();
    }

}

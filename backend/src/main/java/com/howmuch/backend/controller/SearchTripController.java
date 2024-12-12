package com.howmuch.backend.controller;

import com.howmuch.backend.entity.dto.SavePlanDTO;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchTripController {

    private final String CLIENT_ID = "0ad2c726-07c9-40b1-ae02-32efa5048571";

    @PostMapping("/searchTrip")
    public ResponseEntity<String> searchTrip(@RequestBody(required = false) SavePlanDTO myPlan) throws JSONException {

        System.out.println("aiRequest :" + myPlan.getAiRequest());
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
}

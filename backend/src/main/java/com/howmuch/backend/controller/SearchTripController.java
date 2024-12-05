package com.howmuch.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class SearchTripController {

    private final String CLIENT_ID = "0ad2c726-07c9-40b1-ae02-32efa5048571";

    @GetMapping("/searchTrip")
    public ResponseEntity<String> searchTrip() {
        String object ="";

        String requestUrl = "https://kdt-api-function.azurewebsites.net/api/v1/question?content="+
                "제주도 1박2일 여행일정 만들어줘&"+
                "client_id="+ CLIENT_ID;

        try{
            object = new RestTemplate().getForObject(requestUrl, String.class);
            return ResponseEntity.ok(object);
        } catch (Exception e) {
            System.out.println("error");
            return ResponseEntity.badRequest().body("error");
        }


    }


    @GetMapping("/reSearch")
    public ResponseEntity<String> reSearchTrip(String removeItem) {
        String object ="";

        return ResponseEntity.ok(object);
    }
}

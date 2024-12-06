package com.howmuch.backend.controller;

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
    public ResponseEntity<String> searchTrip(@RequestBody(required = false) String removeOrderListJson) throws JSONException {

        boolean isFirstSearch;

        if (removeOrderListJson == null) {
            isFirstSearch = true;
        } else {
            isFirstSearch = false;
        }

        System.out.println(removeOrderListJson);

        String object ="";

        if(!isFirstSearch) {
            // removeOrderList가 비어있지 않은 경우 제거하고 다시 호출!!!
            System.out.println("여기 호출");

            JSONArray jsonArray = new JSONArray(removeOrderListJson);
            List<String> removeList = new ArrayList<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                removeList.add(jsonArray.get(i).toString());
            }

            for (String s : removeList) {
                System.out.println("s = " + s);
            }

            String requestUrl = "https://kdt-api-function.azurewebsites.net/api/v1/question?content=" +
                    "제주도 1박2일 여행일정 만들어줘&" +
                    "client_id=" + CLIENT_ID;

            try {
                object = new RestTemplate().getForObject(requestUrl, String.class);
                return ResponseEntity.ok(object);
            } catch (Exception e) {
                System.out.println("error");
                return ResponseEntity.badRequest().body("error");
            }
        } else {
            // 파라미터가 null 일때 제거할 일정이 없을 때
            String requestUrl = "https://kdt-api-function.azurewebsites.net/api/v1/question?content=" +
                    "제주도 2박3일 여행일정 만들어줘&" +
                    "client_id=" + CLIENT_ID;

            try {
                object = new RestTemplate().getForObject(requestUrl, String.class);
                return ResponseEntity.ok(object);
            } catch (Exception e) {
                System.out.println("error");
                return ResponseEntity.badRequest().body("error");
            }
        }

    }

}

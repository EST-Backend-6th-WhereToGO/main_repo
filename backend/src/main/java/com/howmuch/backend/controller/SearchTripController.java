package com.howmuch.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SearchTripController {

    private final String CLIENT_ID = "0ad2c726-07c9-40b1-ae02-32efa5048571";

    @PostMapping("/searchTrip")
    public ResponseEntity<String> searchTrip(HttpServletResponse response
            , @RequestParam(value="removeOrderList", required = false) String removeOrderListJson) {

        System.out.println(removeOrderListJson);

        String object ="";

        if(removeOrderListJson != null && removeOrderListJson.isEmpty()) {
            // removeOrderList가 비어있지 않은 경우 제거하고 다시 호출!!!

            String requestUrl = "https://kdt-api-function.azurewebsites.net/api/v1/question?content=" +
                    "제주도 1박2일 여행일정 만들어줘&" +
                    "client_id=" + CLIENT_ID;

            try {
                object = new RestTemplate().getForObject(requestUrl, String.class);

                // ModelAndView로 화면을 넘겨보겠다.
                ModelAndView mav = new ModelAndView("mytrip/mytrip_view");
                mav.addObject("object", object);


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

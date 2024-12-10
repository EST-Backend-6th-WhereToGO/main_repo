package com.howmuch.backend.controller;

import com.howmuch.backend.entity.city_info.Category;
import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.dto.PlanRequest;
import com.howmuch.backend.service.CategoryService;
import com.howmuch.backend.service.CityService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/plan")
public class PlanController {

    private final CategoryService categoryService;
    private final CityService cityService;

    public PlanController(CategoryService categoryService, CityService cityService) {
        this.categoryService = categoryService;
        this.cityService = cityService;
    }

    @GetMapping("/form")
    public String showPlanForm(Model model) {
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        return "plan-form";
    }

    @PostMapping("/form")
    public String showCities(@RequestParam("purpose") String purpose,
                             @RequestParam("period") String period,
                             Model model) {

        List<City> cities = cityService.getCitiesByCategory(categoryService.findCategoryIdByName(purpose));

        model.addAttribute("categories", categoryService.getAllCategories());
        model.addAttribute("purpose", purpose);
        model.addAttribute("period", period);
        model.addAttribute("cities", cities);

        return "plan-form";
    }

    @PostMapping("/submit") // 객체에 저장
    public String submitPlan(@RequestParam("purpose") String purpose,
                             @RequestParam("period") String period,
                             @RequestParam("city") String city,
                             Model model) {

        PlanRequest planRequest = new PlanRequest();
        planRequest.setPurpose(purpose);
        planRequest.setPeriod(period);
        planRequest.setCity(city);

        // 필요시 모델에 PlanRequest 추가
        model.addAttribute("planRequest", planRequest);

        // 프롬프터 작성 예시
//        String prompt = String.format(
//                "%s\n목적으로 %s\n동안 %s\n 여행 계획을 만들어줘",
//                planRequest.getPurpose(),
//                planRequest.getDays(),
//                planRequest.getCity()
//        );


        // 결과 페이지로 이동 -> 추후에 연결된페이지
        return "plan-result";
    }
}

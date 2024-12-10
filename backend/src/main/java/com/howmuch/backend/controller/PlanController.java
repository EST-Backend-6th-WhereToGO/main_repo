package com.howmuch.backend.controller;

import com.howmuch.backend.entity.city_info.Category;
import com.howmuch.backend.entity.city_info.City;
import com.howmuch.backend.entity.dto.PlanRequest;
import com.howmuch.backend.entity.dto.SavePlanDTO;
import com.howmuch.backend.entity.user.User;
import com.howmuch.backend.service.CategoryService;
import com.howmuch.backend.service.CityService;
import com.howmuch.backend.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class PlanController {

    private final CategoryService categoryService;
    private final CityService cityService;
    private final UserService userService;

    public PlanController(CategoryService categoryService, CityService cityService
            ,UserService userService) {
        this.categoryService = categoryService;
        this.cityService = cityService;
        this.userService = userService;
    }

    @GetMapping("/plan/form")
    public String showPlanForm(Model model) {
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        return "plan-form";
    }

    @PostMapping("/plan/form")
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

    @PostMapping("/plan/submit") // 객체에 저장
    public String submitPlan(@RequestParam("purpose") String purpose,
                             @RequestParam("period") String period,
                             @RequestParam("city") Long cityId,
                             Model model) {

        PlanRequest planRequest = new PlanRequest();
        planRequest.setPurpose(purpose);
        planRequest.setPeriod(period);

        City selectedCity = cityService.getCityById(cityId);
        planRequest.setCity(selectedCity.getCityName());

        User testUser = userService.getUserById(1L);

        SavePlanDTO savePlanDTO = new SavePlanDTO(planRequest, selectedCity, testUser);


        String aiRequest = String.format(
                "%s 목적으로 %s 동안 %s 여행 계획을 만들어 줘",
                planRequest.getPurpose(),
                planRequest.getDays(),
                planRequest.getCity()
        );

        // 필요시 모델에 PlanRequest 추가
        model.addAttribute("aiRequest", aiRequest);
        model.addAttribute("savePlanDTO", savePlanDTO);


        // 결과 페이지로 이동 -> 추후에 연결된페이지
        return "/mytrip/mytrip_view";
    }
}

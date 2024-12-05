package com.howmuch.backend.youtube;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class YoutubePageController {

    @GetMapping("/yttest")
    public String yttestPage(Model model) {
        // 기본적으로 비어 있는 상태로 화면 렌더링
        model.addAttribute("videoTitle", null);
        model.addAttribute("videoUrl", null);
        return "yttest"; // yttest.html 파일로 연결
    }
}

package com.howmuch.backend.entity.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Data
public class PlanRequest {

    private String purpose;
    private String period;
    private String city;

    private String days;

    private LocalDate startedAt;
    private LocalDate endedAt;

    public void setPeriod(String period) {
        this.period = period;
        if (period != null && period.contains("to")) {
            String[] dates = period.split(" to "); // "YYYY-MM-DD to YYYY-MM-DD"를 분리
            LocalDate startDate = LocalDate.parse(dates[0], DateTimeFormatter.ISO_DATE);
            LocalDate endDate = LocalDate.parse(dates[1], DateTimeFormatter.ISO_DATE);

            this.startedAt = startDate;
            this.endedAt = endDate;

            long nights = ChronoUnit.DAYS.between(startDate, endDate); // 숙박일 계산
            this.days = nights + "박 " + (nights + 1) + "일"; // "X박 X일" 형태로 설정
        } else {
            this.days = "기간이 잘못되었습니다."; // 예외 처리
        }
    }

}

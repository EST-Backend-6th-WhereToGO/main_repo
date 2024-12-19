package com.howmuch.backend.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class CityResponse {
    private Long cityId;
    private String cityName;

}

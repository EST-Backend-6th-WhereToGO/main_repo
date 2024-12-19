package com.howmuch.backend.entity.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MyTripOrder {
    private String time;
    private String place;
    private String day;
    private String order;
}

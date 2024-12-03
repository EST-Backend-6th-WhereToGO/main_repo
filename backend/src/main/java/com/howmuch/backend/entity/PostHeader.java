package com.howmuch.backend.entity;

public enum PostHeader {

    TIP("여행 팁"),
    TRIP("나의 여행");

    final private String name;

    PostHeader(String s) {
        this.name= s;
    }
    public String getName() {
        return name;
    }

}

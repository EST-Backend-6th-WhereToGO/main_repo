package com.howmuch.backend.entity.city_info;

import jakarta.persistence.*;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long category_id;

    @Column(name="category_name", nullable = false)
    private String category_name;
}

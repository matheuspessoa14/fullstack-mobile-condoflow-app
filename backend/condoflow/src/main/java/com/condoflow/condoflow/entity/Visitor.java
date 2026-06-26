package com.condoflow.condoflow.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "visitors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String date;
    private String time;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
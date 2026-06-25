package com.condoflow.condoflow.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String area;
    private String date;
    private String time;
    private String guests;
    private String status;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
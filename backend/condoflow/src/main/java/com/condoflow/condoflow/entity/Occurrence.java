package com.condoflow.condoflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "occurrences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Occurrence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String residentName;

    private String apartmentNumber;

    private String block;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status;

    private LocalDateTime createdAt;
}
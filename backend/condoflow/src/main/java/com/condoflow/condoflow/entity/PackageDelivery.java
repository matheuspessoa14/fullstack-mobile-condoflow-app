package com.condoflow.condoflow.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackageDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resident;
    private String date;
    private String time;
    private String size;
    private String status;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
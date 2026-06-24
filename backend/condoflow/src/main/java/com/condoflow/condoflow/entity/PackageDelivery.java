package com.condoflow.condoflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    private String recipientName;
    private String apartmentNumber;
    private String block;
    private String description;
    private String status;

    private LocalDateTime receivedAt;
    private LocalDateTime deliveredAt;
}
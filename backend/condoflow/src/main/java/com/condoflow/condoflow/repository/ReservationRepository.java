package com.condoflow.condoflow.repository;

import com.condoflow.condoflow.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
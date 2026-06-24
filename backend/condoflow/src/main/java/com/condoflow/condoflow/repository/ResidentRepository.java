package com.condoflow.condoflow.repository;

import com.condoflow.condoflow.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResidentRepository extends JpaRepository<Resident, Long> {
}
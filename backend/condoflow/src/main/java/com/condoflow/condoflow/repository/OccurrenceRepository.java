package com.condoflow.condoflow.repository;

import com.condoflow.condoflow.entity.Occurrence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OccurrenceRepository extends JpaRepository<Occurrence, Long> {
}
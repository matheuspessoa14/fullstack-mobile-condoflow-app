package com.condoflow.condoflow.repository;

import com.condoflow.condoflow.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {
}
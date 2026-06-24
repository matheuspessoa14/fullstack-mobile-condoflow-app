package com.condoflow.condoflow.repository;

import com.condoflow.condoflow.entity.PackageDelivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageDeliveryRepository extends JpaRepository<PackageDelivery, Long> {
}
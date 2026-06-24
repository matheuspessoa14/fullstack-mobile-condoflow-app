package com.condoflow.condoflow.repository;

import com.condoflow.condoflow.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
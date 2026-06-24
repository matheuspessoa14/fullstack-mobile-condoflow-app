package com.condoflow.condoflow.controller;

import com.condoflow.condoflow.entity.Notification;
import com.condoflow.condoflow.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Notification> list() {
        return repository.findAll();
    }

    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        return repository.save(notification);
    }

    @PutMapping("/{id}")
    public Notification update(@PathVariable Long id, @RequestBody Notification data) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));

        notification.setTitle(data.getTitle());
        notification.setMessage(data.getMessage());
        notification.setType(data.getType());
        notification.setCreatedAt(data.getCreatedAt());

        return repository.save(notification);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
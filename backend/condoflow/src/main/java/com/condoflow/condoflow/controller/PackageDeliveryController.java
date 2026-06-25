package com.condoflow.condoflow.controller;

import com.condoflow.condoflow.entity.PackageDelivery;
import com.condoflow.condoflow.repository.PackageDeliveryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "*")
public class PackageDeliveryController {

    private final PackageDeliveryRepository repository;

    public PackageDeliveryController(PackageDeliveryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<PackageDelivery> list() {
        return repository.findAll();
    }

    @PostMapping
    public PackageDelivery create(@RequestBody PackageDelivery packageDelivery) {
        return repository.save(packageDelivery);
    }

    @PutMapping("/{id}")
    public PackageDelivery update(@PathVariable Long id, @RequestBody PackageDelivery data) {
        PackageDelivery packageDelivery = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encomenda não encontrada"));

        packageDelivery.setResident(data.getResident());
        packageDelivery.setDate(data.getDate());
        packageDelivery.setTime(data.getTime());
        packageDelivery.setSize(data.getSize());
        packageDelivery.setStatus(data.getStatus());
        packageDelivery.setNotes(data.getNotes());

        return repository.save(packageDelivery);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
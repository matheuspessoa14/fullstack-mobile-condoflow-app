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

        packageDelivery.setRecipientName(data.getRecipientName());
        packageDelivery.setApartmentNumber(data.getApartmentNumber());
        packageDelivery.setBlock(data.getBlock());
        packageDelivery.setDescription(data.getDescription());
        packageDelivery.setStatus(data.getStatus());
        packageDelivery.setReceivedAt(data.getReceivedAt());
        packageDelivery.setDeliveredAt(data.getDeliveredAt());

        return repository.save(packageDelivery);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
package com.condoflow.condoflow.controller;

import com.condoflow.condoflow.entity.Resident;
import com.condoflow.condoflow.repository.ResidentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residents")
@CrossOrigin(origins = "*")
public class ResidentController {

    private final ResidentRepository repository;

    public ResidentController(ResidentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Resident> list() {
        return repository.findAll();
    }

    @PostMapping
    public Resident create(@RequestBody Resident resident) {
        return repository.save(resident);
    }

    @PutMapping("/{id}")
    public Resident update(@PathVariable Long id, @RequestBody Resident data) {
        Resident resident = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Morador não encontrado"));

        resident.setName(data.getName());
        resident.setCpf(data.getCpf());
        resident.setPhone(data.getPhone());
        resident.setEmail(data.getEmail());
        resident.setApartmentNumber(data.getApartmentNumber());
        resident.setBlock(data.getBlock());

        return repository.save(resident);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
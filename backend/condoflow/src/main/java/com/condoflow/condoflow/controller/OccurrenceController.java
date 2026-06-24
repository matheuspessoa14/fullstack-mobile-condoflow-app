package com.condoflow.condoflow.controller;

import com.condoflow.condoflow.entity.Occurrence;
import com.condoflow.condoflow.repository.OccurrenceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/occurrences")
@CrossOrigin(origins = "*")
public class OccurrenceController {

    private final OccurrenceRepository repository;

    public OccurrenceController(OccurrenceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Occurrence> list() {
        return repository.findAll();
    }

    @PostMapping
    public Occurrence create(@RequestBody Occurrence occurrence) {
        return repository.save(occurrence);
    }

    @PutMapping("/{id}")
    public Occurrence update(@PathVariable Long id,
                             @RequestBody Occurrence data) {

        Occurrence occurrence = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ocorrência não encontrada"));

        occurrence.setResidentName(data.getResidentName());
        occurrence.setApartmentNumber(data.getApartmentNumber());
        occurrence.setBlock(data.getBlock());
        occurrence.setTitle(data.getTitle());
        occurrence.setDescription(data.getDescription());
        occurrence.setStatus(data.getStatus());
        occurrence.setCreatedAt(data.getCreatedAt());

        return repository.save(occurrence);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
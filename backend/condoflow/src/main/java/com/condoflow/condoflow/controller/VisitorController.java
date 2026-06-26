package com.condoflow.condoflow.controller;

import com.condoflow.condoflow.entity.Visitor;
import com.condoflow.condoflow.repository.VisitorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@CrossOrigin(origins = "*")
public class VisitorController {

    private final VisitorRepository repository;

    public VisitorController(VisitorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Visitor> list() {
        return repository.findAll();
    }

    @PostMapping
    public Visitor create(@RequestBody Visitor visitor) {
        return repository.save(visitor);
    }

    @PutMapping("/{id}")
    public Visitor update(@PathVariable Long id, @RequestBody Visitor data) {
        Visitor visitor = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitante não encontrado"));

        visitor.setName(data.getName());
        visitor.setEmail(data.getEmail());
        visitor.setDate(data.getDate());
        visitor.setTime(data.getTime());
        visitor.setNotes(data.getNotes());

        return repository.save(visitor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
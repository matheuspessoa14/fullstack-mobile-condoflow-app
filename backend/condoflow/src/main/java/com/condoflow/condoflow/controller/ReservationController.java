package com.condoflow.condoflow.controller;

import com.condoflow.condoflow.entity.Reservation;
import com.condoflow.condoflow.repository.ReservationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationRepository repository;

    public ReservationController(ReservationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Reservation> list() {
        return repository.findAll();
    }

    @PostMapping
    public Reservation create(@RequestBody Reservation reservation) {
        return repository.save(reservation);
    }

    @PutMapping("/{id}")
    public Reservation update(@PathVariable Long id, @RequestBody Reservation data) {

        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        reservation.setArea(data.getArea());
        reservation.setDate(data.getDate());
        reservation.setTime(data.getTime());
        reservation.setGuests(data.getGuests());
        reservation.setStatus(data.getStatus());
        reservation.setNotes(data.getNotes());

        return repository.save(reservation);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
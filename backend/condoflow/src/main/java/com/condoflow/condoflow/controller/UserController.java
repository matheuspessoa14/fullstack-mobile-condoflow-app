package com.condoflow.condoflow.controller;

import com.condoflow.condoflow.entity.User;
import com.condoflow.condoflow.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<UserResponse> list() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@RequestBody CreateUserRequest request) {

        String name = normalize(request.name());
        String email = normalizeEmail(request.email());
        String password = normalize(request.password());
        String role = normalizeRole(request.role());

        if (name.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nome é obrigatório."
            );
        }

        if (email.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O e-mail é obrigatório."
            );
        }

        if (password.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A senha é obrigatória."
            );
        }

        if (repository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um usuário cadastrado com esse e-mail."
            );
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(password)
                .role(role)
                .build();

        return toResponse(repository.save(user));
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        String email = normalizeEmail(request.email());
        String password = normalize(request.password());

        if (email.isEmpty() || password.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe o e-mail e a senha."
            );
        }

        User user = repository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha inválidos."
                ));

        if (!user.getPassword().equals(password)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "E-mail ou senha inválidos."
            );
        }

        String role = normalizeRole(user.getRole());

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                role
        );
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                normalizeRole(user.getRole())
        );
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeEmail(String email) {
        return normalize(email).toLowerCase();
    }

    private String normalizeRole(String role) {
        String normalizedRole = normalize(role).toLowerCase();

        return switch (normalizedRole) {
            case "porteiro" -> "porteiro";
            case "sindico", "síndico" -> "sindico";
            default -> "morador";
        };
    }

    public record LoginRequest(
            String email,
            String password
    ) {
    }

    public record LoginResponse(
            Long id,
            String name,
            String email,
            String role
    ) {
    }

    public record CreateUserRequest(
            String name,
            String email,
            String password,
            String role
    ) {
    }

    public record UserResponse(
            Long id,
            String name,
            String email,
            String role
    ) {
    }
}
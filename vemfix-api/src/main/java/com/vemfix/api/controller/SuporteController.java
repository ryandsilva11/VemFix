package com.vemfix.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vemfix.api.dto.SuporteRequestDTO;
import com.vemfix.api.dto.SuporteResponseDTO;
import com.vemfix.api.service.SuporteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/suporte")
public class SuporteController {

    private final SuporteService service;

    public SuporteController(SuporteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SuporteResponseDTO> create(@RequestBody @Valid SuporteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<SuporteResponseDTO>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuporteResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SuporteResponseDTO> atualizarStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(service.atualizarStatus(id, status));
    }
}

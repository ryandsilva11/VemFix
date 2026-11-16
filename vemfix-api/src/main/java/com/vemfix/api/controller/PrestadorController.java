package com.vemfix.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vemfix.api.dto.PrestadorRequestDTO;
import com.vemfix.api.dto.PrestadorResponseDTO;
import com.vemfix.api.dto.PrestadorUpdateDTO;
import com.vemfix.api.service.PrestadorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/prestadores")
public class PrestadorController {

    private PrestadorService service;

    public PrestadorController(PrestadorService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PrestadorResponseDTO> create(@RequestBody @Valid PrestadorRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<PrestadorResponseDTO>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrestadorResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PrestadorResponseDTO> alterar(@RequestBody @Valid PrestadorUpdateDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(service.alterarDados(dto, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        service.inativar(id);
        return ResponseEntity.noContent().build();
    }
}

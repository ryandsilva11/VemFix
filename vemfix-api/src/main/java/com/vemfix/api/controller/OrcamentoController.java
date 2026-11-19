package com.vemfix.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vemfix.api.dto.OrcamentoRequestDTO;
import com.vemfix.api.dto.OrcamentoResponseDTO;
import com.vemfix.api.service.OrcamentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orcamentos")
public class OrcamentoController {

    private final OrcamentoService service;

    public OrcamentoController(OrcamentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<OrcamentoResponseDTO> criar(@RequestBody @Valid OrcamentoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<OrcamentoResponseDTO>> listarPorChat(@PathVariable Long chatId) {
        return ResponseEntity.ok(service.listarPorChat(chatId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrcamentoResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<OrcamentoResponseDTO>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/prestador/{prestadorId}")
    public ResponseEntity<List<OrcamentoResponseDTO>> listarPorPrestador(@PathVariable Long prestadorId) {
        return ResponseEntity.ok(service.listarPorPrestador(prestadorId));
    }
}

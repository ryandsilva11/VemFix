package com.vemfix.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vemfix.api.dto.ChatRequestDTO;
import com.vemfix.api.dto.ChatResponseDTO;
import com.vemfix.api.service.ChatService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/chats")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService service;

    public ChatController(ChatService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> iniciarChat(@RequestBody @Valid ChatRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.OK).body(service.iniciarOuBuscarChat(dto));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<ChatResponseDTO>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/prestador/{prestadorId}")
    public ResponseEntity<List<ChatResponseDTO>> listarPorPrestador(@PathVariable Long prestadorId) {
        return ResponseEntity.ok(service.listarPorPrestador(prestadorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
}

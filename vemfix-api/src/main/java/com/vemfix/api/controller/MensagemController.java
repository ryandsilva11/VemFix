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

import com.vemfix.api.dto.MensagemRequestDTO;
import com.vemfix.api.dto.MensagemResponseDTO;
import com.vemfix.api.service.MensagemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/mensagens")
public class MensagemController {

    private final MensagemService service;

    public MensagemController(MensagemService service) {
        this.service = service;
    }

    @PostMapping("/{chatId}")
    public ResponseEntity<MensagemResponseDTO> enviarMensagem(@PathVariable Long chatId,
                                                             @RequestBody @Valid MensagemRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.enviarMensagem(chatId, dto));
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<List<MensagemResponseDTO>> listarPorChat(@PathVariable Long chatId) {
        return ResponseEntity.ok(service.listarPorChat(chatId));
    }
}

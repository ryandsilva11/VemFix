package com.vemfix.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vemfix.api.dto.CurtidaRequestDTO;
import com.vemfix.api.dto.PostRequestDTO;
import com.vemfix.api.dto.PostResponseDTO;
import com.vemfix.api.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService service;

    public PostController(PostService service) {
        this.service = service;
    }

    @PostMapping("/{prestadorId}")
    public ResponseEntity<PostResponseDTO> create(@RequestBody @Valid PostRequestDTO dto,
            @PathVariable Long prestadorId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto, prestadorId));
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> listAll(
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(service.listAll(usuarioId, tipo));
    }

    @GetMapping("/prestador/{prestadorId}")
    public ResponseEntity<List<PostResponseDTO>> findByPrestadorId(
            @PathVariable Long prestadorId,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(service.findByPrestadorId(prestadorId, usuarioId, tipo));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PostResponseDTO> curtir(
            @PathVariable Long id,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) String tipo,
            @RequestBody(required = false) CurtidaRequestDTO dto) {
        Long finalUsuarioId = usuarioId != null ? usuarioId : (dto != null ? dto.usuarioId() : null);
        String finalTipo = tipo != null ? tipo : (dto != null ? dto.tipo() : null);
        return ResponseEntity.ok(service.curtir(id, finalUsuarioId, finalTipo));
    }
}

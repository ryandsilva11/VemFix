package com.vemfix.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.vemfix.api.dto.PostRequestDTO;
import com.vemfix.api.dto.PostResponseDTO;
import com.vemfix.api.service.PostService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private PostService service;

    public PostController(PostService service) {
        this.service = service;
    }

    @PostMapping("/{prestadorId}")
    public ResponseEntity<PostResponseDTO> create(@RequestBody @Valid PostRequestDTO dto,
            @PathVariable Long prestadorId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto, prestadorId));
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/prestador/{prestadorId}")
    public ResponseEntity<List<PostResponseDTO>> findByPrestadorId(@PathVariable Long prestadorId) {
        return ResponseEntity.ok(service.findByPrestadorId(prestadorId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PostResponseDTO> curtir(@PathVariable Long id) {
        return ResponseEntity.ok(service.curtir(id));
    }
}

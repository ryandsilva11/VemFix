package com.vemfix.api.dto;

public record LoginResponseDTO(
        Long id,
        String nome,
        String email,
        String tipo,
        String telefone,
        String cidade,
        String catServico) {
}

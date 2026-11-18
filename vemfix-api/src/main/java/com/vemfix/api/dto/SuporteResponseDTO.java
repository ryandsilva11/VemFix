package com.vemfix.api.dto;

import java.time.LocalDateTime;

import com.vemfix.api.model.Suporte;

public record SuporteResponseDTO(
        Long id,
        String nome,
        String email,
        String assunto,
        String mensagem,
        LocalDateTime dataEnvio,
        String status
) {
    public SuporteResponseDTO(Suporte suporte) {
        this(
                suporte.getId(),
                suporte.getNome(),
                suporte.getEmail(),
                suporte.getAssunto(),
                suporte.getMensagem(),
                suporte.getDataEnvio(),
                suporte.getStatus()
        );
    }
}

package com.vemfix.api.dto;

import java.time.LocalDateTime;

import com.vemfix.api.model.Chat;

public record ChatResponseDTO(
        Long id,
        Long clienteId,
        String clienteNome,
        Long prestadorId,
        String prestadorNome,
        String prestadorCatServico,
        Long prestadorSolicitanteId,
        String prestadorSolicitanteNome,
        String prestadorSolicitanteCatServico,
        String solicitanteTipo,
        LocalDateTime dataCriacao,
        LocalDateTime ultimaMensagem
) {
    public ChatResponseDTO(Chat chat) {
        this(
                chat.getId(),
                chat.getCliente() != null
                        ? chat.getCliente().getId()
                        : (chat.getPrestadorSolicitante() != null ? chat.getPrestadorSolicitante().getId() : null),
                chat.getCliente() != null
                        ? chat.getCliente().getNome()
                        : (chat.getPrestadorSolicitante() != null ? chat.getPrestadorSolicitante().getNome() : null),
                chat.getPrestador().getId(),
                chat.getPrestador().getNome(),
                chat.getPrestador() != null ? chat.getPrestador().getCatServico() : null,
                chat.getPrestadorSolicitante() != null ? chat.getPrestadorSolicitante().getId() : null,
                chat.getPrestadorSolicitante() != null ? chat.getPrestadorSolicitante().getNome() : null,
                chat.getPrestadorSolicitante() != null ? chat.getPrestadorSolicitante().getCatServico() : null,
                chat.getPrestadorSolicitante() != null ? "PRESTADOR" : "CLIENTE",
                chat.getDataCriacao(),
                chat.getUltimaMensagem()
        );
    }
}

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
        LocalDateTime dataCriacao,
        LocalDateTime ultimaMensagem
) {
    public ChatResponseDTO(Chat chat) {
        this(
                chat.getId(),
                chat.getCliente().getId(),
                chat.getCliente().getNome(),
                chat.getPrestador().getId(),
                chat.getPrestador().getNome(),
                chat.getPrestador() != null ? chat.getPrestador().getCatServico() : null,
                chat.getDataCriacao(),
                chat.getUltimaMensagem()
        );
    }
}

package com.vemfix.api.dto;

import java.time.LocalDateTime;

import com.vemfix.api.model.Mensagem;

public record MensagemResponseDTO(
        Long id,
        Long chatId,
        String remetenteTipo,
        String conteudo,
        String anexo,
        LocalDateTime dataEnvio,
        boolean lida
) {
    public MensagemResponseDTO(Mensagem mensagem) {
        this(
                mensagem.getId(),
                mensagem.getChat().getId(),
                mensagem.getRemetenteTipo(),
                mensagem.getConteudo(),
                mensagem.getAnexo(),
                mensagem.getDataEnvio(),
                mensagem.isLida()
        );
    }
}

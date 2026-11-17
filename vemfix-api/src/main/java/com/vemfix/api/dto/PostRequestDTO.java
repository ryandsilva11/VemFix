package com.vemfix.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequestDTO(
        @NotBlank(message = "O título do post é obrigatório") @Size(max = 100, message = "O título deve ter no máximo 100 caracteres") String titulo,

        String anexo,

        @Size(max = 1000, message = "A descrção deve ter no máximo 1000 caracteres") String descricao) {
}

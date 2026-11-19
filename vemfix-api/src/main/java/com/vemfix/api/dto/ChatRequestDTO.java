package com.vemfix.api.dto;

import jakarta.validation.constraints.NotNull;

public record ChatRequestDTO(
        @NotNull(message = "O ID do cliente é obrigatório")
        Long clienteId,

        @NotNull(message = "O ID do prestador é obrigatório")
        Long prestadorId
) {
}

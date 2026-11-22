package com.vemfix.api.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

public record ChatRequestDTO(
        Long clienteId,

        Long prestadorSolicitanteId,

        @NotNull(message = "O ID do prestador é obrigatório")
        Long prestadorId
) {
    @AssertTrue(message = "O chat deve conter um clienteId ou prestadorSolicitanteId válido")
    public boolean isParticipanteValido() {
        return (clienteId != null && prestadorSolicitanteId == null) ||
               (clienteId == null && prestadorSolicitanteId != null);
    }
}

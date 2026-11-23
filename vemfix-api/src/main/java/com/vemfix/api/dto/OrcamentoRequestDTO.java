package com.vemfix.api.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record OrcamentoRequestDTO(
        @NotNull(message = "O ID do chat é obrigatório")
        Long chatId,

        @NotBlank(message = "O título do orçamento é obrigatório")
        @Size(max = 100, message = "O título deve ter no máximo 100 caracteres")
        String titulo,

        @NotNull(message = "O valor é obrigatório")
        @Positive(message = "O valor deve ser maior que zero")
        Double valor,

        @NotBlank(message = "O CEP é obrigatório")
        @Size(max = 20, message = "O CEP deve ter no máximo 20 caracteres")
        String cep,

        @NotBlank(message = "A descrição do problema é obrigatória")
        @Size(max = 1000, message = "A descrição do problema deve ter no máximo 1000 caracteres")
        String descProblema,

        @NotBlank(message = "A descrição do serviço é obrigatória")
        @Size(max = 1000, message = "A descrição do serviço deve ter no máximo 1000 caracteres")
        String descServico,

        String anexo,

        LocalDateTime dataHora
) {
}

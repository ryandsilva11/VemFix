package com.vemfix.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SuporteRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "O e-mail deve ser válido")
        @Size(max = 100, message = "O e-mail deve ter no máximo 100 caracteres")
        String email,

        @NotBlank(message = "O assunto é obrigatório")
        @Size(max = 100, message = "O assunto deve ter no máximo 100 caracteres")
        String assunto,

        @NotBlank(message = "A mensagem é obrigatória")
        @Size(max = 1000, message = "A mensagem deve ter no máximo 1000 caracteres")
        String mensagem
) {
}

package com.vemfix.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PrestadorUpdateDTO(
        String nome,

        @NotBlank(message = "O telefone é obrigatório")
        @Size(min = 10, max = 11, message = "O telefone deve ter entre 10 e 11 dígitos")
        String telefone,

        @NotBlank(message = "A cidade é obrigatória")
        String cidade,

        String senha,

        @NotBlank(message = "A categoria de serviço é obrigatória")
        String catServico,

        @Size(max = 2000)
        String exp) {
}

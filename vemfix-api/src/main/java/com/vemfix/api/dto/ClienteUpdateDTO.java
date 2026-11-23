package com.vemfix.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteUpdateDTO(
        String nome,

        @NotBlank(message = "O telefone é obrigatório")
        @Size(min = 10, max = 11, message = "O telefone deve ter entre 10 e 11 dígitos")
        String telefone,

        @NotBlank(message = "O CEP é obrigatório")
        String cep,

        String senha) {
}

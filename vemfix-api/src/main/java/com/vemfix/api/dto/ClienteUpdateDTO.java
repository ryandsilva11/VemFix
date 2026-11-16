package com.vemfix.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteUpdateDTO(
        @NotBlank(message = "O nome é obrigatório") String nome,

        @NotBlank(message = "O telefone é obrigatório") @Size(min = 10, max = 11, message = "O telefone deve ter entre 10 e 11 dígitos") String telefone,

        @NotBlank(message = "A cidade é obrigatória") String cidade,

        @NotBlank(message = "A senha é obrigatória") @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres") String senha) {

}

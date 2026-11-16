package com.vemfix.api.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record PrestadorRequestDTO(
        @NotBlank(message = "O nome é obrigatório") String nome,

        @NotBlank(message = "O CPF é obrigatório") @Size(min = 11, max = 11, message = "O CPF deve ter 11 dígitos") String cpf,

        @NotBlank(message = "O email é obrigatório") @Email(message = "Formato de email inválido") String email,

        @NotBlank(message = "A senha é obrigatória") @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres") String senha,

        @NotBlank(message = "O telefone é obrigatório") @Size(min = 10, max = 11, message = "O telefone deve ter entre 10 e 11 dígitos") String telefone,

        @NotBlank(message = "A cidade é obrigatória") String cidade,

        @NotNull(message = "A data de nascimento é obrigatória") @Past(message = "A data de nascimento deve ser uma data no passado") LocalDate dataNasc,

        @NotBlank(message = "A categoria de serviço é obrigatória") String catServico,

        @Size(max = 2000) String exp) {
}

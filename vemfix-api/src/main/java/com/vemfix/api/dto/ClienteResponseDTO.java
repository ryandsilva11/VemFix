package com.vemfix.api.dto;

import java.time.LocalDate;

import com.vemfix.api.model.Cliente;

public record ClienteResponseDTO(
        Long id,
        String nome,
        String cpf,
        String email,
        String telefone,
        String cep,
        LocalDate dataNasc,
        boolean IsActive) {
    public ClienteResponseDTO(Cliente cliente) {
        this(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpf(),
                cliente.getEmail(),
                cliente.getTelefone(),
                cliente.getCep(),
                cliente.getDataNasc(),
                cliente.getIsActive());
    }
}

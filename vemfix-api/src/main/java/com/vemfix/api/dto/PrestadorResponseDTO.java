package com.vemfix.api.dto;

import java.time.LocalDate;

import com.vemfix.api.model.Prestador;

public record PrestadorResponseDTO(
        Long id,
        String nome,
        String cpf,
        String email,
        String telefone,
        String cep,
        LocalDate dataNasc,
        String catServico,
        String exp,
        Double avaliacao,
        boolean IsActive) {
    public PrestadorResponseDTO(Prestador prestador) {
        this(
                prestador.getId(),
                prestador.getNome(),
                prestador.getCpf(),
                prestador.getEmail(),
                prestador.getTelefone(),
                prestador.getCep(),
                prestador.getDataNasc(),
                prestador.getCatServico(),
                prestador.getExp(),
                prestador.getAvaliacao(),
                prestador.getIsActive());
    }
}

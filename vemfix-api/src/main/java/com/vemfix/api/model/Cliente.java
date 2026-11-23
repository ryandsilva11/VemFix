package com.vemfix.api.model;

import com.vemfix.api.dto.ClienteRequestDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_cliente")
public class Cliente extends Usuario {

    public Cliente() {
    }

    public Cliente(ClienteRequestDTO dto) {
        this.setCpf(dto.cpf());
        this.setNome(dto.nome());
        this.setEmail(dto.email());
        this.setSenha(dto.senha());
        this.setTelefone(dto.telefone());
        this.setCep(dto.cep());
        this.setDataNasc(dto.dataNasc());
    }
}

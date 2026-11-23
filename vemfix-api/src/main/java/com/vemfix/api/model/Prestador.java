package com.vemfix.api.model;

import com.vemfix.api.dto.PrestadorRequestDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_prestador")
public class Prestador extends Usuario {

    @Column
    private String catServico;

    @Column
    private String exp;

    @Column
    private Double avaliacao;

    // Construtor vazio
    public Prestador() {
        super();
    }

    // Construtor com os atributos da superclasse + atributos próprios
    public Prestador(PrestadorRequestDTO dto) {
        this.setCpf(dto.cpf());
        this.setNome(dto.nome());
        this.setEmail(dto.email());
        this.setSenha(dto.senha());
        this.setTelefone(dto.telefone());
        this.setCep(dto.cep());
        this.setDataNasc(dto.dataNasc());

        // E os campos próprios do Prestador:
        this.catServico = dto.catServico();
        this.exp = dto.exp();
        this.avaliacao = 0.0;
    }

    // Getters e Setters
    public String getCatServico() {
        return catServico;
    }

    public void setCatServico(String catServico) {
        this.catServico = catServico;
    }

    public String getExp() {
        return exp;
    }

    public void setExp(String exp) {
        this.exp = exp;
    }

    public Double getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(Double avaliacao) {
        this.avaliacao = avaliacao;
    }
}

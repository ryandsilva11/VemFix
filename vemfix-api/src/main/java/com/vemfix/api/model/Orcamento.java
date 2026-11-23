package com.vemfix.api.model;

import java.time.LocalDateTime;

import com.vemfix.api.dto.OrcamentoRequestDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_orcamento")
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false)
    private Double valor;

    @Column(nullable = false, length = 20)
    private String cep;

    @Column(nullable = false, length = 1000)
    private String descProblema;

    @Column(nullable = false, length = 1000)
    private String descServico;

    @Column(columnDefinition = "LONGTEXT")
    private String anexo;

    @Column(nullable = false)
    private LocalDateTime dataHora = LocalDateTime.now();

    public Orcamento() {
    }

    public Orcamento(Chat chat, OrcamentoRequestDTO dto) {
        this.chat = chat;
        this.titulo = dto.titulo();
        this.valor = dto.valor();
        this.cep = dto.cep();
        this.descProblema = dto.descProblema();
        this.descServico = dto.descServico();
        this.anexo = dto.anexo();
        this.dataHora = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getDescProblema() {
        return descProblema;
    }

    public void setDescProblema(String descProblema) {
        this.descProblema = descProblema;
    }

    public String getDescServico() {
        return descServico;
    }

    public void setDescServico(String descServico) {
        this.descServico = descServico;
    }

    public String getAnexo() {
        return anexo;
    }

    public void setAnexo(String anexo) {
        this.anexo = anexo;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}

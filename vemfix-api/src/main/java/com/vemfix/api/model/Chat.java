package com.vemfix.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_chat")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = true)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "prestador_solicitante_id", nullable = true)
    private Prestador prestadorSolicitante;

    @ManyToOne
    @JoinColumn(name = "prestador_id", nullable = false)
    private Prestador prestador;

    @Column(nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime ultimaMensagem = LocalDateTime.now();

    public Chat() {
    }

    public Chat(Cliente cliente, Prestador prestador) {
        this.cliente = cliente;
        this.prestador = prestador;
        this.dataCriacao = LocalDateTime.now();
        this.ultimaMensagem = LocalDateTime.now();
    }

    public Chat(Prestador prestadorSolicitante, Prestador prestador) {
        this.prestadorSolicitante = prestadorSolicitante;
        this.prestador = prestador;
        this.dataCriacao = LocalDateTime.now();
        this.ultimaMensagem = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Prestador getPrestadorSolicitante() {
        return prestadorSolicitante;
    }

    public void setPrestadorSolicitante(Prestador prestadorSolicitante) {
        this.prestadorSolicitante = prestadorSolicitante;
    }

    public Prestador getPrestador() {
        return prestador;
    }

    public void setPrestador(Prestador prestador) {
        this.prestador = prestador;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getUltimaMensagem() {
        return ultimaMensagem;
    }

    public void setUltimaMensagem(LocalDateTime ultimaMensagem) {
        this.ultimaMensagem = ultimaMensagem;
    }
}

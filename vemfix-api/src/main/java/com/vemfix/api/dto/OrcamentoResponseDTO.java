package com.vemfix.api.dto;

import java.time.LocalDateTime;

import com.vemfix.api.model.Orcamento;

public record OrcamentoResponseDTO(
        Long id,
        Long chatId,
        Long clienteId,
        String clienteNome,
        Long prestadorId,
        String prestadorNome,
        String titulo,
        Double valor,
        String cep,
        String descProblema,
        String descServico,
        String anexo,
        LocalDateTime dataHora
) {
    public OrcamentoResponseDTO(Orcamento o) {
        this(
                o.getId(),
                o.getChat().getId(),
                o.getChat().getCliente() != null
                        ? o.getChat().getCliente().getId()
                        : (o.getChat().getPrestadorSolicitante() != null
                                ? o.getChat().getPrestadorSolicitante().getId()
                                : null),
                o.getChat().getCliente() != null
                        ? o.getChat().getCliente().getNome()
                        : (o.getChat().getPrestadorSolicitante() != null
                                ? o.getChat().getPrestadorSolicitante().getNome()
                                : "Cliente"),
                o.getChat().getPrestador().getId(),
                o.getChat().getPrestador().getNome(),
                o.getTitulo(),
                o.getValor(),
                o.getCep(),
                o.getDescProblema(),
                o.getDescServico(),
                o.getAnexo(),
                o.getDataHora()
        );
    }
}

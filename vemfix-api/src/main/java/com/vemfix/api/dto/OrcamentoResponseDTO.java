package com.vemfix.api.dto;

import java.time.LocalDateTime;

import com.vemfix.api.model.Orcamento;

public record OrcamentoResponseDTO(
        Long id,
        Long chatId,
        String clienteNome,
        String prestadorNome,
        String titulo,
        Double valor,
        String endereco,
        String descProblema,
        String descServico,
        String anexo,
        LocalDateTime dataHora
) {
    public OrcamentoResponseDTO(Orcamento o) {
        this(
                o.getId(),
                o.getChat().getId(),
                o.getChat().getCliente().getNome(),
                o.getChat().getPrestador().getNome(),
                o.getTitulo(),
                o.getValor(),
                o.getEndereco(),
                o.getDescProblema(),
                o.getDescServico(),
                o.getAnexo(),
                o.getDataHora()
        );
    }
}

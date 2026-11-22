package com.vemfix.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vemfix.api.model.Orcamento;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    // Lista os orçamentos de um chat específico (mais recentes primeiro)
    List<Orcamento> findByChatIdOrderByDataHoraDesc(Long chatId);

    // Lista todos os orçamentos recebidos por um solicitante (seja cliente ou prestador solicitante)
    @Query("SELECT o FROM Orcamento o WHERE (o.chat.cliente IS NOT NULL AND o.chat.cliente.id = :usuarioId) OR (o.chat.prestadorSolicitante IS NOT NULL AND o.chat.prestadorSolicitante.id = :usuarioId) ORDER BY o.dataHora DESC")
    List<Orcamento> findOrcamentosRecebidosPorUsuario(@Param("usuarioId") Long usuarioId);

    // Lista todos os orçamentos recebidos por um cliente
    List<Orcamento> findByChatClienteIdOrderByDataHoraDesc(Long clienteId);

    // Lista todos os orçamentos emitidos por um prestador
    List<Orcamento> findByChatPrestadorIdOrderByDataHoraDesc(Long prestadorId);
}

package com.vemfix.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vemfix.api.model.Orcamento;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    // Lista os orçamentos de um chat específico (mais recentes primeiro)
    List<Orcamento> findByChatIdOrderByDataHoraDesc(Long chatId);

    // Lista todos os orçamentos recebidos por um cliente (para tela "Meus Orçamentos")
    List<Orcamento> findByChatClienteIdOrderByDataHoraDesc(Long clienteId);

    // Lista todos os orçamentos emitidos por um prestador
    List<Orcamento> findByChatPrestadorIdOrderByDataHoraDesc(Long prestadorId);
}

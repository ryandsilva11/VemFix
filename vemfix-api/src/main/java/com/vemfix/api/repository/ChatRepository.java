package com.vemfix.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vemfix.api.model.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Lista todas as conversas de um cliente, da mais recente para a mais antiga
    List<Chat> findByClienteIdOrderByUltimaMensagemDesc(Long clienteId);

    // Lista todas as conversas de um prestador, da mais recente para a mais antiga
    List<Chat> findByPrestadorIdOrderByUltimaMensagemDesc(Long prestadorId);

    // Busca conversa já existente entre um cliente e um prestador específico
    Optional<Chat> findByClienteIdAndPrestadorId(Long clienteId, Long prestadorId);
}

package com.vemfix.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vemfix.api.model.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Lista todas as conversas de um cliente, da mais recente para a mais antiga
    List<Chat> findByClienteIdOrderByUltimaMensagemDesc(Long clienteId);

    // Lista todas as conversas de um prestador (como contratado OU como solicitante)
    @Query("SELECT c FROM Chat c WHERE c.prestador.id = :prestadorId OR c.prestadorSolicitante.id = :prestadorId ORDER BY c.ultimaMensagem DESC")
    List<Chat> findByPrestadorIdOrderByUltimaMensagemDesc(@Param("prestadorId") Long prestadorId);

    // Busca conversa já existente entre um cliente e um prestador específico
    Optional<Chat> findByClienteIdAndPrestadorId(Long clienteId, Long prestadorId);

    // Busca conversa já existente entre um prestador solicitante e um prestador específico
    Optional<Chat> findByPrestadorSolicitanteIdAndPrestadorId(Long prestadorSolicitanteId, Long prestadorId);
}

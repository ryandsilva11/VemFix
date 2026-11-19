package com.vemfix.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vemfix.api.model.Mensagem;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    // Lista todas as mensagens de um chat em ordem cronológica (mais antigas primeiro, como no WhatsApp)
    List<Mensagem> findByChatIdOrderByDataEnvioAsc(Long chatId);
}

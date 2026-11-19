package com.vemfix.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vemfix.api.dto.MensagemRequestDTO;
import com.vemfix.api.dto.MensagemResponseDTO;
import com.vemfix.api.model.Chat;
import com.vemfix.api.model.Mensagem;
import com.vemfix.api.repository.ChatRepository;
import com.vemfix.api.repository.MensagemRepository;

@Service
public class MensagemService {

    private final MensagemRepository mensagemRepository;
    private final ChatRepository chatRepository;

    public MensagemService(MensagemRepository mensagemRepository, ChatRepository chatRepository) {
        this.mensagemRepository = mensagemRepository;
        this.chatRepository = chatRepository;
    }

    @Transactional
    public MensagemResponseDTO enviarMensagem(Long chatId, MensagemRequestDTO dto) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat não encontrado com o ID: " + chatId));

        Mensagem mensagem = new Mensagem(chat, dto.remetenteTipo(), dto.conteudo(), dto.anexo());
        Mensagem mensagemSalva = mensagemRepository.save(mensagem);

        // Atualiza o relógio do chat para ele subir para o topo da lista de conversas
        chat.setUltimaMensagem(mensagemSalva.getDataEnvio());
        chatRepository.save(chat);

        return new MensagemResponseDTO(mensagemSalva);
    }

    @Transactional(readOnly = true)
    public List<MensagemResponseDTO> listarPorChat(Long chatId) {
        if (!chatRepository.existsById(chatId)) {
            throw new RuntimeException("Chat não encontrado com o ID: " + chatId);
        }

        return mensagemRepository.findByChatIdOrderByDataEnvioAsc(chatId).stream()
                .map(MensagemResponseDTO::new)
                .toList();
    }
}

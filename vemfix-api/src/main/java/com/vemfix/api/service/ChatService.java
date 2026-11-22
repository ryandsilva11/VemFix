package com.vemfix.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vemfix.api.dto.ChatRequestDTO;
import com.vemfix.api.dto.ChatResponseDTO;
import com.vemfix.api.model.Chat;
import com.vemfix.api.model.Cliente;
import com.vemfix.api.model.Prestador;
import com.vemfix.api.repository.ChatRepository;
import com.vemfix.api.repository.ClienteRepository;
import com.vemfix.api.repository.PrestadorRepository;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final ClienteRepository clienteRepository;
    private final PrestadorRepository prestadorRepository;

    public ChatService(ChatRepository chatRepository,
                       ClienteRepository clienteRepository,
                       PrestadorRepository prestadorRepository) {
        this.chatRepository = chatRepository;
        this.clienteRepository = clienteRepository;
        this.prestadorRepository = prestadorRepository;
    }

    @Transactional
    public ChatResponseDTO iniciarOuBuscarChat(ChatRequestDTO dto) {
        // Caso 1: Prestador solicitando serviço de outro Prestador
        if (dto.prestadorSolicitanteId() != null) {
            if (dto.prestadorSolicitanteId().equals(dto.prestadorId())) {
                throw new RuntimeException("Um prestador não pode iniciar uma conversa consigo mesmo.");
            }

            Optional<Chat> chatExistente = chatRepository.findByPrestadorSolicitanteIdAndPrestadorId(
                    dto.prestadorSolicitanteId(), dto.prestadorId());
            if (chatExistente.isPresent()) {
                return new ChatResponseDTO(chatExistente.get());
            }

            Prestador solicitante = prestadorRepository.findById(dto.prestadorSolicitanteId())
                    .orElseThrow(() -> new RuntimeException("Prestador solicitante não encontrado com o ID: " + dto.prestadorSolicitanteId()));

            Prestador prestador = prestadorRepository.findById(dto.prestadorId())
                    .orElseThrow(() -> new RuntimeException("Prestador não encontrado com o ID: " + dto.prestadorId()));

            Chat novoChat = new Chat(solicitante, prestador);
            return new ChatResponseDTO(chatRepository.save(novoChat));
        }

        // Caso 2: Cliente solicitando serviço de um Prestador
        Optional<Chat> chatExistente = chatRepository.findByClienteIdAndPrestadorId(dto.clienteId(), dto.prestadorId());
        if (chatExistente.isPresent()) {
            return new ChatResponseDTO(chatExistente.get());
        }

        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID: " + dto.clienteId()));

        Prestador prestador = prestadorRepository.findById(dto.prestadorId())
                .orElseThrow(() -> new RuntimeException("Prestador não encontrado com o ID: " + dto.prestadorId()));

        Chat novoChat = new Chat(cliente, prestador);
        return new ChatResponseDTO(chatRepository.save(novoChat));
    }

    @Transactional(readOnly = true)
    public List<ChatResponseDTO> listarPorCliente(Long clienteId) {
        return chatRepository.findByClienteIdOrderByUltimaMensagemDesc(clienteId).stream()
                .map(ChatResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChatResponseDTO> listarPorPrestador(Long prestadorId) {
        return chatRepository.findByPrestadorIdOrderByUltimaMensagemDesc(prestadorId).stream()
                .map(ChatResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ChatResponseDTO findById(Long id) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat não encontrado com o ID: " + id));
        return new ChatResponseDTO(chat);
    }

    @Transactional
    public void atualizarUltimaMensagem(Long chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat não encontrado com o ID: " + chatId));
        chat.setUltimaMensagem(LocalDateTime.now());
        chatRepository.save(chat);
    }
}

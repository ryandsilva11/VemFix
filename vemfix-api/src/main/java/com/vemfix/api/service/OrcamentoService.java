package com.vemfix.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vemfix.api.dto.OrcamentoRequestDTO;
import com.vemfix.api.dto.OrcamentoResponseDTO;
import com.vemfix.api.model.Chat;
import com.vemfix.api.model.Orcamento;
import com.vemfix.api.repository.ChatRepository;
import com.vemfix.api.repository.OrcamentoRepository;

@Service
public class OrcamentoService {

    private final OrcamentoRepository orcamentoRepository;
    private final ChatRepository chatRepository;

    public OrcamentoService(OrcamentoRepository orcamentoRepository, ChatRepository chatRepository) {
        this.orcamentoRepository = orcamentoRepository;
        this.chatRepository = chatRepository;
    }

    @Transactional
    public OrcamentoResponseDTO criar(OrcamentoRequestDTO dto) {
        Chat chat = chatRepository.findById(dto.chatId())
                .orElseThrow(() -> new RuntimeException("Chat não encontrado com o ID: " + dto.chatId()));

        Orcamento orcamento = new Orcamento(chat, dto);
        Orcamento orcamentoSalvo = orcamentoRepository.save(orcamento);

        chat.setUltimaMensagem(orcamentoSalvo.getDataHora());
        chatRepository.save(chat);

        return new OrcamentoResponseDTO(orcamentoSalvo);
    }

    @Transactional(readOnly = true)
    public List<OrcamentoResponseDTO> listarPorChat(Long chatId) {
        if (!chatRepository.existsById(chatId)) {
            throw new RuntimeException("Chat não encontrado com o ID: " + chatId);
        }

        return orcamentoRepository.findByChatIdOrderByDataHoraDesc(chatId).stream()
                .map(OrcamentoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrcamentoResponseDTO findById(Long id) {
        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado com o ID: " + id));
        return new OrcamentoResponseDTO(orcamento);
    }

    @Transactional(readOnly = true)
    public List<OrcamentoResponseDTO> listarPorCliente(Long clienteId) {
        return orcamentoRepository.findOrcamentosRecebidosPorUsuario(clienteId).stream()
                .map(OrcamentoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrcamentoResponseDTO> listarPorPrestador(Long prestadorId) {
        return orcamentoRepository.findByChatPrestadorIdOrderByDataHoraDesc(prestadorId).stream()
                .map(OrcamentoResponseDTO::new)
                .toList();
    }
}

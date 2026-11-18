package com.vemfix.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vemfix.api.dto.SuporteRequestDTO;
import com.vemfix.api.dto.SuporteResponseDTO;
import com.vemfix.api.model.Suporte;
import com.vemfix.api.repository.SuporteRepository;

@Service
public class SuporteService {

    private final SuporteRepository repository;

    public SuporteService(SuporteRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SuporteResponseDTO create(SuporteRequestDTO dto) {
        Suporte suporte = new Suporte(dto);
        return new SuporteResponseDTO(repository.save(suporte));
    }

    @Transactional(readOnly = true)
    public List<SuporteResponseDTO> listAll() {
        return repository.findAllByOrderByDataEnvioDesc().stream()
                .map(SuporteResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public SuporteResponseDTO findById(Long id) {
        Suporte suporte = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chamado de suporte não encontrado com o ID: " + id));
        return new SuporteResponseDTO(suporte);
    }

    @Transactional
    public SuporteResponseDTO atualizarStatus(Long id, String status) {
        Suporte suporte = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chamado de suporte não encontrado com o ID: " + id));
        suporte.setStatus(status);
        return new SuporteResponseDTO(repository.save(suporte));
    }
}

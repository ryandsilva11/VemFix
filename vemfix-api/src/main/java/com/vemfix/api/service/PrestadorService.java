package com.vemfix.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vemfix.api.dto.PrestadorRequestDTO;
import com.vemfix.api.dto.PrestadorResponseDTO;
import com.vemfix.api.dto.PrestadorUpdateDTO;
import com.vemfix.api.model.Prestador;
import com.vemfix.api.repository.PrestadorRepository;

@Service
public class PrestadorService {

    private final PrestadorRepository repository;

    public PrestadorService(PrestadorRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public PrestadorResponseDTO create(PrestadorRequestDTO dto) {
        if (repository.existsByCpf(dto.cpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        Prestador prestador = new Prestador(dto);
        prestador = repository.save(prestador);
        return new PrestadorResponseDTO(prestador);
    }

    @Transactional(readOnly = true)
    public List<PrestadorResponseDTO> listAll() {
        return repository.findAll().stream().map(PrestadorResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public PrestadorResponseDTO findById(Long id) {
        Prestador prestador = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador não encontrado com o ID " + id));
        return new PrestadorResponseDTO(prestador);
    }

    @Transactional
    public PrestadorResponseDTO alterarDados(PrestadorUpdateDTO dto, Long id) {
        Prestador prestador = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador não encontrado com o ID " + id));
        prestador.setNome(dto.nome());
        prestador.setTelefone(dto.telefone());
        prestador.setCidade(dto.cidade());
        prestador.setSenha(dto.senha());
        prestador.setCatServico(dto.catServico());
        prestador.setExp(dto.exp());
        prestador = repository.save(prestador);
        return new PrestadorResponseDTO(prestador);
    }

    @Transactional
    public void inativar(Long id) {
        Prestador prestador = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador não encontrado com o ID " + id));
        prestador.setIsActive(false);
        repository.save(prestador);
    }
}

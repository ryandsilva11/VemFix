package com.vemfix.api.service;

import org.springframework.stereotype.Service;

import com.vemfix.api.dto.ClienteRequestDTO;
import com.vemfix.api.dto.ClienteResponseDTO;
import com.vemfix.api.dto.ClienteUpdateDTO;
import com.vemfix.api.model.Cliente;
import java.util.List;

import com.vemfix.api.repository.ClienteRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ClienteResponseDTO create(ClienteRequestDTO dto) {
        if (repository.existsByCpf(dto.cpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        Cliente cliente = new Cliente(dto);
        cliente = repository.save(cliente);
        return new ClienteResponseDTO(cliente);
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listAll() {
        return repository.findAll().stream().map(ClienteResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO findById(Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID " + id));
        return new ClienteResponseDTO(cliente);
    }

    @Transactional
    public ClienteResponseDTO alterarDados(ClienteUpdateDTO dto, Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID " + id));
        cliente.setNome(dto.nome());
        cliente.setTelefone(dto.telefone());
        cliente.setCidade(dto.cidade());
        cliente.setSenha(dto.senha());

        cliente = repository.save(cliente);
        return new ClienteResponseDTO(cliente);
    }

    @Transactional
    public void inativar(Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID" + id));
        cliente.setIsActive(false);
        repository.save(cliente);
    }
}
package com.vemfix.api.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vemfix.api.dto.LoginRequestDTO;
import com.vemfix.api.dto.LoginResponseDTO;
import com.vemfix.api.model.Cliente;
import com.vemfix.api.model.Prestador;
import com.vemfix.api.repository.ClienteRepository;
import com.vemfix.api.repository.PrestadorRepository;

@Service
public class AuthService {

    private final ClienteRepository clienteRepository;
    private final PrestadorRepository prestadorRepository;

    public AuthService(ClienteRepository clienteRepository, PrestadorRepository prestadorRepository) {
        this.clienteRepository = clienteRepository;
        this.prestadorRepository = prestadorRepository;
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO autenticar(LoginRequestDTO dto) {
        // 1. Busca por cliente com o e-mail informado
        Optional<Cliente> clienteOpt = clienteRepository.findByEmail(dto.email());
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            if (cliente.getSenha() != null && cliente.getSenha().equals(dto.senha())) {
                return new LoginResponseDTO(
                        cliente.getId(),
                        cliente.getNome(),
                        cliente.getEmail(),
                        "CLIENTE",
                        cliente.getTelefone(),
                        cliente.getCep(),
                        null);
            }
        }

        // 2. Busca por prestador com o e-mail informado
        Optional<Prestador> prestadorOpt = prestadorRepository.findByEmail(dto.email());
        if (prestadorOpt.isPresent()) {
            Prestador prestador = prestadorOpt.get();
            if (prestador.getSenha() != null && prestador.getSenha().equals(dto.senha())) {
                return new LoginResponseDTO(
                        prestador.getId(),
                        prestador.getNome(),
                        prestador.getEmail(),
                        "PRESTADOR",
                        prestador.getTelefone(),
                        prestador.getCep(),
                        prestador.getCatServico());
            }
        }

        // 3. E-mail não encontrado ou senha incorreta
        throw new RuntimeException("E-mail ou senha inválidos.");
    }
}

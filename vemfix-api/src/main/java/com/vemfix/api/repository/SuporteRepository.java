package com.vemfix.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vemfix.api.model.Suporte;

@Repository
public interface SuporteRepository extends JpaRepository<Suporte, Long> {

    // Lista todos os chamados do mais recente para o mais antigo (Painel de Suporte)
    List<Suporte> findAllByOrderByDataEnvioDesc();

    // Filtra chamados por status (ex: "ABERTO", "RESOLVIDO")
    List<Suporte> findByStatusOrderByDataEnvioDesc(String status);

    // Busca os chamados enviados por um e-mail específico
    List<Suporte> findByEmailOrderByDataEnvioDesc(String email);
}

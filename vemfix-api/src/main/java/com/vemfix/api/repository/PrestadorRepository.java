package com.vemfix.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vemfix.api.model.Prestador;

@Repository
public interface PrestadorRepository extends JpaRepository<Prestador, Long> {

    boolean existsByCpf(String cpf);

    boolean existsByEmail(String email);
}

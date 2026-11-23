package com.vemfix.api.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vemfix.api.model.PostCurtida;

@Repository
public interface PostCurtidaRepository extends JpaRepository<PostCurtida, Long> {

    boolean existsByPostIdAndClienteId(Long postId, Long clienteId);

    boolean existsByPostIdAndPrestadorId(Long postId, Long prestadorId);

    @Modifying
    @Query("DELETE FROM PostCurtida c WHERE c.post.id = :postId AND c.cliente.id = :clienteId")
    void deleteByPostIdAndClienteId(@Param("postId") Long postId, @Param("clienteId") Long clienteId);

    @Modifying
    @Query("DELETE FROM PostCurtida c WHERE c.post.id = :postId AND c.prestador.id = :prestadorId")
    void deleteByPostIdAndPrestadorId(@Param("postId") Long postId, @Param("prestadorId") Long prestadorId);

    @Query("SELECT c.post.id FROM PostCurtida c WHERE c.cliente.id = :clienteId")
    Set<Long> findPostIdsByClienteId(@Param("clienteId") Long clienteId);

    @Query("SELECT c.post.id FROM PostCurtida c WHERE c.prestador.id = :prestadorId")
    Set<Long> findPostIdsByPrestadorId(@Param("prestadorId") Long prestadorId);

    long countByPostId(Long postId);
}

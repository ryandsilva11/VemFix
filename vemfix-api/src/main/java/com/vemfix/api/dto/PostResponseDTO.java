package com.vemfix.api.dto;

import java.time.LocalDateTime;

import com.vemfix.api.model.Post;
import com.vemfix.api.model.Prestador;

public record PostResponseDTO(
        Long id,
        String titulo,
        String anexo,
        String descricao,
        LocalDateTime dataCriacao,
        Long curtidas,
        Prestador prestador) {
    public PostResponseDTO(Post post) {
        this(
                post.getId(),
                post.getTitulo(),
                post.getAnexo(),
                post.getDescricao(),
                post.getDataCriacao(),
                post.getCurtidas(),
                post.getPrestador());
    }
}

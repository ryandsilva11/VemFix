package com.vemfix.api.service;

import org.springframework.stereotype.Service;

import com.vemfix.api.dto.PostRequestDTO;
import com.vemfix.api.dto.PostResponseDTO;
import com.vemfix.api.model.Post;
import java.util.List;
import com.vemfix.api.model.Prestador;
import com.vemfix.api.repository.PostRepository;
import com.vemfix.api.repository.PrestadorRepository;

import jakarta.transaction.Transactional;

@Service
public class PostService {

    private PostRepository postRepository;
    private PrestadorRepository prestRepository;

    public PostService(PostRepository postRepository, PrestadorRepository prestRepository) {
        this.postRepository = postRepository;
        this.prestRepository = prestRepository;
    }

    @Transactional
    public PostResponseDTO create(PostRequestDTO dto, Long id) {
        Prestador prestador = prestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prestador não encontrado com o ID" + id));

        Post post = new Post(dto);
        post.setPrestador(prestador);
        return new PostResponseDTO(postRepository.save(post));
    }

    @Transactional
    public List<PostResponseDTO> listAll() {
        return postRepository.findByOrderByDataCriacaoDesc().stream().map(PostResponseDTO::new).toList();
    }

    @Transactional
    public PostResponseDTO curtir(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post não encontrado com o ID " + id));
        post.setCurtidas(post.getCurtidas() + 1);
        return new PostResponseDTO(postRepository.save(post));
    }
}

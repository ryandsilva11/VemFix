package com.vemfix.api.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.vemfix.api.dto.PostRequestDTO;
import com.vemfix.api.dto.PostResponseDTO;
import com.vemfix.api.model.Cliente;
import com.vemfix.api.model.Post;
import com.vemfix.api.model.PostCurtida;
import com.vemfix.api.model.Prestador;
import com.vemfix.api.repository.ClienteRepository;
import com.vemfix.api.repository.PostCurtidaRepository;
import com.vemfix.api.repository.PostRepository;
import com.vemfix.api.repository.PrestadorRepository;

import jakarta.transaction.Transactional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final PrestadorRepository prestRepository;
    private final ClienteRepository clienteRepository;
    private final PostCurtidaRepository postCurtidaRepository;

    public PostService(
            PostRepository postRepository,
            PrestadorRepository prestRepository,
            ClienteRepository clienteRepository,
            PostCurtidaRepository postCurtidaRepository) {
        this.postRepository = postRepository;
        this.prestRepository = prestRepository;
        this.clienteRepository = clienteRepository;
        this.postCurtidaRepository = postCurtidaRepository;
    }

    @Transactional
    public PostResponseDTO create(PostRequestDTO dto, Long id) {
        Prestador prestador = prestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestador não encontrado com o ID " + id));

        Post post = new Post(dto);
        post.setPrestador(prestador);
        post.setCurtidas(0L);
        return new PostResponseDTO(postRepository.save(post), false);
    }

    @Transactional
    public List<PostResponseDTO> listAll(Long usuarioId, String tipo) {
        List<Post> posts = postRepository.findByOrderByDataCriacaoDesc();
        Set<Long> curtidos = getPostIdsCurtidosPeloUsuario(usuarioId, tipo);
        return posts.stream()
                .map(p -> new PostResponseDTO(p, curtidos.contains(p.getId())))
                .toList();
    }

    @Transactional
    public List<PostResponseDTO> listAll() {
        return listAll(null, null);
    }

    @Transactional
    public List<PostResponseDTO> findByPrestadorId(Long prestadorId, Long usuarioId, String tipo) {
        List<Post> posts = postRepository.findByPrestadorId(prestadorId);
        Set<Long> curtidos = getPostIdsCurtidosPeloUsuario(usuarioId, tipo);
        return posts.stream()
                .map(p -> new PostResponseDTO(p, curtidos.contains(p.getId())))
                .toList();
    }

    @Transactional
    public List<PostResponseDTO> findByPrestadorId(Long prestadorId) {
        return findByPrestadorId(prestadorId, null, null);
    }

    @Transactional
    public PostResponseDTO curtir(Long postId, Long usuarioId, String tipo) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post não encontrado com o ID " + postId));

        if (usuarioId == null || tipo == null || tipo.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário não identificado para curtir/descurtir o post.");
        }

        boolean isCliente = "CLIENTE".equalsIgnoreCase(tipo.trim());
        boolean jaCurtiu;

        if (isCliente) {
            jaCurtiu = postCurtidaRepository.existsByPostIdAndClienteId(postId, usuarioId);
        } else {
            jaCurtiu = postCurtidaRepository.existsByPostIdAndPrestadorId(postId, usuarioId);
        }

        boolean agoraCurtido;
        if (jaCurtiu) {
            // Descurtir: remove o registro de curtida desse usuário
            if (isCliente) {
                postCurtidaRepository.deleteByPostIdAndClienteId(postId, usuarioId);
            } else {
                postCurtidaRepository.deleteByPostIdAndPrestadorId(postId, usuarioId);
            }
            long curtidasAtuais = post.getCurtidas() != null ? post.getCurtidas() : 0L;
            post.setCurtidas(Math.max(0L, curtidasAtuais - 1));
            agoraCurtido = false;
        } else {
            // Curtir: salva a curtida na conta do usuário
            if (isCliente) {
                Cliente cliente = clienteRepository.findById(usuarioId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado com o ID " + usuarioId));
                postCurtidaRepository.save(new PostCurtida(post, cliente));
            } else {
                Prestador prestador = prestRepository.findById(usuarioId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestador não encontrado com o ID " + usuarioId));
                postCurtidaRepository.save(new PostCurtida(post, prestador));
            }
            long curtidasAtuais = post.getCurtidas() != null ? post.getCurtidas() : 0L;
            post.setCurtidas(curtidasAtuais + 1);
            agoraCurtido = true;
        }

        Post salvo = postRepository.save(post);
        return new PostResponseDTO(salvo, agoraCurtido);
    }

    private Set<Long> getPostIdsCurtidosPeloUsuario(Long usuarioId, String tipo) {
        if (usuarioId == null || tipo == null || tipo.isBlank()) {
            return Collections.emptySet();
        }
        if ("CLIENTE".equalsIgnoreCase(tipo.trim())) {
            return postCurtidaRepository.findPostIdsByClienteId(usuarioId);
        } else {
            return postCurtidaRepository.findPostIdsByPrestadorId(usuarioId);
        }
    }
}

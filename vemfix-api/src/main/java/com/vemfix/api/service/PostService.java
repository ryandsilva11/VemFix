package com.vemfix.api.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Prestador não encontrado com o ID " + id));

        Post post = new Post(dto);
        post.setPrestador(prestador);
        post.setCurtidas(0L);
        return new PostResponseDTO(postRepository.save(post), false);
    }

    @Transactional(readOnly = true)
    public List<PostResponseDTO> listAll(Long usuarioId, String tipo) {
        List<Post> posts = postRepository.findByOrderByDataCriacaoDesc();
        Set<Long> curtidos = getPostIdsCurtidosPeloUsuario(usuarioId, tipo);
        return posts.stream()
                .map(p -> new PostResponseDTO(p, curtidos.contains(p.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostResponseDTO> listAll() {
        return listAll(null, null);
    }

    @Transactional(readOnly = true)
    public List<PostResponseDTO> findByPrestadorId(Long prestadorId, Long usuarioId, String tipo) {
        List<Post> posts = postRepository.findByPrestadorId(prestadorId);
        Set<Long> curtidos = getPostIdsCurtidosPeloUsuario(usuarioId, tipo);
        return posts.stream()
                .map(p -> new PostResponseDTO(p, curtidos.contains(p.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostResponseDTO> findByPrestadorId(Long prestadorId) {
        return findByPrestadorId(prestadorId, null, null);
    }

    @Transactional
    public PostResponseDTO curtir(Long postId, Long usuarioId, String tipo) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Post não encontrado com o ID " + postId));

        if (usuarioId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Usuário não identificado para curtir/descurtir o post.");
        }

        Cliente cliente = null;
        Prestador prestador = null;

        // Resolve o usuário autenticado por tipo ou por existência no banco com fallback seguro
        if ("CLIENTE".equalsIgnoreCase(tipo)) {
            cliente = clienteRepository.findById(usuarioId).orElse(null);
            if (cliente == null) {
                prestador = prestRepository.findById(usuarioId).orElse(null);
            }
        } else if ("PRESTADOR".equalsIgnoreCase(tipo)) {
            prestador = prestRepository.findById(usuarioId).orElse(null);
            if (prestador == null) {
                cliente = clienteRepository.findById(usuarioId).orElse(null);
            }
        } else {
            // Tipo não informado: verifica em cliente e depois prestador
            cliente = clienteRepository.findById(usuarioId).orElse(null);
            if (cliente == null) {
                prestador = prestRepository.findById(usuarioId).orElse(null);
            }
        }

        if (cliente == null && prestador == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Usuário não encontrado com o ID " + usuarioId);
        }

        boolean agoraCurtido;
        if (cliente != null) {
            boolean jaCurtiu = postCurtidaRepository.existsByPostIdAndClienteId(postId, cliente.getId());
            if (jaCurtiu) {
                postCurtidaRepository.deleteByPostIdAndClienteId(postId, cliente.getId());
                long curtidasAtuais = post.getCurtidas() != null ? post.getCurtidas() : 0L;
                post.setCurtidas(Math.max(0L, curtidasAtuais - 1));
                agoraCurtido = false;
            } else {
                postCurtidaRepository.save(new PostCurtida(post, cliente));
                long curtidasAtuais = post.getCurtidas() != null ? post.getCurtidas() : 0L;
                post.setCurtidas(curtidasAtuais + 1);
                agoraCurtido = true;
            }
        } else {
            boolean jaCurtiu = postCurtidaRepository.existsByPostIdAndPrestadorId(postId, prestador.getId());
            if (jaCurtiu) {
                postCurtidaRepository.deleteByPostIdAndPrestadorId(postId, prestador.getId());
                long curtidasAtuais = post.getCurtidas() != null ? post.getCurtidas() : 0L;
                post.setCurtidas(Math.max(0L, curtidasAtuais - 1));
                agoraCurtido = false;
            } else {
                postCurtidaRepository.save(new PostCurtida(post, prestador));
                long curtidasAtuais = post.getCurtidas() != null ? post.getCurtidas() : 0L;
                post.setCurtidas(curtidasAtuais + 1);
                agoraCurtido = true;
            }
        }

        Post salvo = postRepository.save(post);
        return new PostResponseDTO(salvo, agoraCurtido);
    }

    private Set<Long> getPostIdsCurtidosPeloUsuario(Long usuarioId, String tipo) {
        if (usuarioId == null) {
            return Collections.emptySet();
        }
        if ("CLIENTE".equalsIgnoreCase(tipo)) {
            Set<Long> set = postCurtidaRepository.findPostIdsByClienteId(usuarioId);
            if (!set.isEmpty() || clienteRepository.existsById(usuarioId)) {
                return set;
            }
            return postCurtidaRepository.findPostIdsByPrestadorId(usuarioId);
        } else if ("PRESTADOR".equalsIgnoreCase(tipo)) {
            Set<Long> set = postCurtidaRepository.findPostIdsByPrestadorId(usuarioId);
            if (!set.isEmpty() || prestRepository.existsById(usuarioId)) {
                return set;
            }
            return postCurtidaRepository.findPostIdsByClienteId(usuarioId);
        } else {
            if (clienteRepository.existsById(usuarioId)) {
                return postCurtidaRepository.findPostIdsByClienteId(usuarioId);
            }
            if (prestRepository.existsById(usuarioId)) {
                return postCurtidaRepository.findPostIdsByPrestadorId(usuarioId);
            }
            return Collections.emptySet();
        }
    }
}

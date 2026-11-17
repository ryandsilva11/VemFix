package com.vemfix.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vemfix.api.model.Post;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    public List<Post> findByPrestadorId(Long prestadorId);

    public List<Post> findByOrderByDataCriacaoDesc();
}

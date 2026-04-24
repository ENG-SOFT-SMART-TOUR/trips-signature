package com.signaturetrips.api.domain.repository;

import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.domain.entity.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {

    @EntityGraph(attributePaths = {"destino"})
    List<Roteiro> findByUsuarioOrderByCriadoEmDesc(Usuario usuario);
}

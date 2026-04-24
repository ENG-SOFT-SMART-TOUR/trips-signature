package com.signaturetrips.api.domain.repository;

import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.domain.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {
    List<Roteiro> findByUsuarioOrderByCriadoEmDesc(Usuario usuario);
}

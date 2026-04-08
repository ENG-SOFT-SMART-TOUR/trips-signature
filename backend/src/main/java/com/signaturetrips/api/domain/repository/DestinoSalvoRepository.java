package com.signaturetrips.api.domain.repository;

import com.signaturetrips.api.domain.entity.DestinoSalvo;
import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.entity.Destino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DestinoSalvoRepository extends JpaRepository<DestinoSalvo, Long> {
    List<DestinoSalvo> findByUsuario(Usuario usuario);
    boolean existsByUsuarioAndDestino(Usuario usuario, Destino destino);
    Optional<DestinoSalvo> findByUsuarioAndDestino(Usuario usuario, Destino destino);
}

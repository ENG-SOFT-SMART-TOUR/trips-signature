package com.signaturetrips.api.domain.repository;

import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.domain.entity.Usuario;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {

    @EntityGraph(attributePaths = {"destino"})
    List<Roteiro> findByUsuarioOrderByCriadoEmDesc(Usuario usuario);

    @EntityGraph(attributePaths = {"destino", "usuario"})
    Optional<Roteiro> findWithAssociacoesById(Long id);

    /**
     * Loads the roteiro under a pessimistic write lock so concurrent activity
     * inserts on the same roteiro serialise — keeps the per-day limit and the
     * duplicate check race-free.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Roteiro r where r.id = :id")
    Optional<Roteiro> findByIdForUpdate(Long id);
}

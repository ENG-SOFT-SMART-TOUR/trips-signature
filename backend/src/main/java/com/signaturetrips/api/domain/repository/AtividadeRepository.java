package com.signaturetrips.api.domain.repository;

import com.signaturetrips.api.domain.entity.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

    List<Atividade> findByDestinoId(Long destinoId);
}

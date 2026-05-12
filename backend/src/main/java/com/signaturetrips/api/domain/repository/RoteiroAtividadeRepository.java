package com.signaturetrips.api.domain.repository;

import com.signaturetrips.api.domain.entity.RoteiroAtividade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoteiroAtividadeRepository extends JpaRepository<RoteiroAtividade, Long> {

    List<RoteiroAtividade> findByRoteiroId(Long roteiroId);

    int countByRoteiroIdAndDiaNumero(Long roteiroId, int diaNumero);

    Optional<RoteiroAtividade> findByRoteiroIdAndAtividadeIdAndDiaNumero(Long roteiroId, Long atividadeId, int diaNumero);
}

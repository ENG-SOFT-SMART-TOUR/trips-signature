package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Atividade;
import com.signaturetrips.api.domain.repository.AtividadeRepository;
import com.signaturetrips.api.domain.repository.DestinoRepository;
import com.signaturetrips.api.dto.AtividadeResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AtividadeService {

    private final AtividadeRepository atividadeRepository;
    private final DestinoRepository destinoRepository;

    public AtividadeService(AtividadeRepository atividadeRepository, DestinoRepository destinoRepository) {
        this.atividadeRepository = atividadeRepository;
        this.destinoRepository = destinoRepository;
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarPorDestino(Long destinoId, String turno) {
        if (!destinoRepository.existsById(destinoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Destino não encontrado");
        }
        List<Atividade> atividades = (turno == null || turno.isBlank())
                ? atividadeRepository.findByDestinoId(destinoId)
                : atividadeRepository.findByDestinoIdAndTurnoIgnoreCase(destinoId, turno.trim());
        return atividades.stream()
                .map(AtividadeResponse::from)
                .toList();
    }
}

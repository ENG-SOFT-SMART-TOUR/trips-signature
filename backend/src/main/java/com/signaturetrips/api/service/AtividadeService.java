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
    public List<AtividadeResponse> listarPorDestino(Long destinoId) {
        if (!destinoRepository.existsById(destinoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Destino não encontrado");
        }
        return atividadeRepository.findByDestinoId(destinoId).stream()
                .map(this::toResponse)
                .toList();
    }

    private AtividadeResponse toResponse(Atividade a) {
        return new AtividadeResponse(
                a.getId(), a.getNome(), a.getCategoria(),
                a.getDuracao(), a.getTurno(), a.getDescricao(),
                a.getFoto(), a.getLatitude(), a.getLongitude()
        );
    }
}

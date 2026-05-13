package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Atividade;
import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.domain.entity.RoteiroAtividade;
import com.signaturetrips.api.domain.repository.AtividadeRepository;
import com.signaturetrips.api.domain.repository.RoteiroAtividadeRepository;
import com.signaturetrips.api.domain.repository.RoteiroRepository;
import com.signaturetrips.api.dto.RoteiroAtividadeRequest;
import com.signaturetrips.api.dto.RoteiroAtividadeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RoteiroAtividadeService {

    @Value("${roteiro.max-atividades-por-dia:5}")
    private int maxAtividadesPorDia;

    private final RoteiroRepository roteiroRepository;
    private final AtividadeRepository atividadeRepository;
    private final RoteiroAtividadeRepository roteiroAtividadeRepository;

    public RoteiroAtividadeService(RoteiroRepository roteiroRepository,
                                   AtividadeRepository atividadeRepository,
                                   RoteiroAtividadeRepository roteiroAtividadeRepository) {
        this.roteiroRepository = roteiroRepository;
        this.atividadeRepository = atividadeRepository;
        this.roteiroAtividadeRepository = roteiroAtividadeRepository;
    }

    @Transactional(readOnly = true)
    public List<RoteiroAtividadeResponse> listar(Long roteiroId) {
        if (!roteiroRepository.existsById(roteiroId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Roteiro não encontrado");
        }
        return roteiroAtividadeRepository.findByRoteiroId(roteiroId).stream()
                .map(ra -> new RoteiroAtividadeResponse(ra.getAtividade().getId(), ra.getDiaNumero()))
                .toList();
    }

    @Transactional
    public RoteiroAtividadeResponse adicionar(Long roteiroId, RoteiroAtividadeRequest request) {
        Roteiro roteiro = roteiroRepository.findWithAssociacoesById(roteiroId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Roteiro não encontrado"));

        int totalDias = roteiro.calcularTotalDias();
        if (request.diaNumero() < 1 || request.diaNumero() > totalDias) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Dia inválido. O roteiro tem " + totalDias + " dias.");
        }

        int count = roteiroAtividadeRepository.countByRoteiroIdAndDiaNumero(roteiroId, request.diaNumero());
        if (count >= maxAtividadesPorDia) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Máximo de " + maxAtividadesPorDia + " atividades por dia atingido.");
        }

        Atividade atividade = atividadeRepository.findById(request.atividadeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atividade não encontrada"));

        if (!atividade.getDestino().getId().equals(roteiro.getDestino().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A atividade não pertence ao destino do roteiro.");
        }

        boolean jaExiste = roteiroAtividadeRepository
                .findByRoteiroIdAndAtividadeIdAndDiaNumero(roteiroId, request.atividadeId(), request.diaNumero())
                .isPresent();
        if (jaExiste) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Atividade já adicionada neste dia.");
        }

        RoteiroAtividade ra = new RoteiroAtividade();
        ra.setRoteiro(roteiro);
        ra.setAtividade(atividade);
        ra.setDiaNumero(request.diaNumero());

        roteiroAtividadeRepository.save(ra);
        return new RoteiroAtividadeResponse(atividade.getId(), request.diaNumero());
    }

    @Transactional
    public void remover(Long roteiroId, Long atividadeId, int diaNumero) {
        RoteiroAtividade ra = roteiroAtividadeRepository
                .findByRoteiroIdAndAtividadeIdAndDiaNumero(roteiroId, atividadeId, diaNumero)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado"));
        roteiroAtividadeRepository.delete(ra);
    }
}

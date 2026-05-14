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
    public List<RoteiroAtividadeResponse> listar(Long roteiroId, Long usuarioId) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        validarPropriedade(roteiro, usuarioId);
        return roteiroAtividadeRepository.findByRoteiroId(roteiroId).stream()
                .map(ra -> new RoteiroAtividadeResponse(ra.getAtividade().getId(), ra.getDiaNumero()))
                .toList();
    }

    @Transactional
    public RoteiroAtividadeResponse adicionar(Long roteiroId, Long usuarioId, RoteiroAtividadeRequest request) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        validarPropriedade(roteiro, usuarioId);
        validarDiaNumero(roteiro, request.diaNumero());
        validarLimitePorDia(roteiroId, request.diaNumero());

        Atividade atividade = buscarAtividade(request.atividadeId());
        validarCompatibilidadeComDestino(atividade, roteiro);
        validarSemDuplicata(roteiroId, request.atividadeId(), request.diaNumero());

        RoteiroAtividade ra = new RoteiroAtividade();
        ra.setRoteiro(roteiro);
        ra.setAtividade(atividade);
        ra.setDiaNumero(request.diaNumero());

        roteiroAtividadeRepository.save(ra);
        return new RoteiroAtividadeResponse(atividade.getId(), request.diaNumero());
    }

    @Transactional
    public void remover(Long roteiroId, Long usuarioId, Long atividadeId, int diaNumero) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        validarPropriedade(roteiro, usuarioId);

        RoteiroAtividade ra = roteiroAtividadeRepository
                .findByRoteiroIdAndAtividadeIdAndDiaNumero(roteiroId, atividadeId, diaNumero)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Atividade não encontrada neste dia do roteiro"));
        roteiroAtividadeRepository.delete(ra);
    }

    private Roteiro buscarRoteiro(Long id) {
        return roteiroRepository.findWithAssociacoesById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Roteiro não encontrado"));
    }

    private void validarPropriedade(Roteiro roteiro, Long usuarioId) {
        if (!roteiro.getUsuario().getId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
    }

    private Atividade buscarAtividade(Long id) {
        return atividadeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atividade não encontrada"));
    }

    private void validarDiaNumero(Roteiro roteiro, int diaNumero) {
        int totalDias = roteiro.calcularTotalDias();
        if (diaNumero < 1 || diaNumero > totalDias) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Dia inválido. O roteiro tem " + totalDias + " dias.");
        }
    }

    private void validarLimitePorDia(Long roteiroId, int diaNumero) {
        int count = roteiroAtividadeRepository.countByRoteiroIdAndDiaNumero(roteiroId, diaNumero);
        if (count >= maxAtividadesPorDia) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Máximo de " + maxAtividadesPorDia + " atividades por dia atingido.");
        }
    }

    private void validarCompatibilidadeComDestino(Atividade atividade, Roteiro roteiro) {
        if (!atividade.getDestino().getId().equals(roteiro.getDestino().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A atividade não pertence ao destino do roteiro.");
        }
    }

    private void validarSemDuplicata(Long roteiroId, Long atividadeId, int diaNumero) {
        boolean jaExiste = roteiroAtividadeRepository
                .findByRoteiroIdAndAtividadeIdAndDiaNumero(roteiroId, atividadeId, diaNumero)
                .isPresent();
        if (jaExiste) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Atividade já adicionada neste dia.");
        }
    }
}

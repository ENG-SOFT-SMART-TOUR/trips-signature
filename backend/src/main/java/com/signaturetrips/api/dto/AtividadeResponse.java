package com.signaturetrips.api.dto;

import com.signaturetrips.api.domain.entity.Atividade;

public record AtividadeResponse(
        Long id,
        String nome,
        String categoria,
        String duracao,
        String turno,
        String descricao,
        String foto,
        Double latitude,
        Double longitude
) {
    public static AtividadeResponse from(Atividade atividade) {
        return new AtividadeResponse(
                atividade.getId(),
                atividade.getNome(),
                atividade.getCategoria(),
                atividade.getDuracao(),
                atividade.getTurno(),
                atividade.getDescricao(),
                atividade.getFoto(),
                atividade.getLatitude(),
                atividade.getLongitude()
        );
    }
}

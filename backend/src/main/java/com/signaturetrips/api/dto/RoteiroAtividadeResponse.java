package com.signaturetrips.api.dto;

import com.signaturetrips.api.domain.entity.RoteiroAtividade;

public record RoteiroAtividadeResponse(
        Long atividadeId,
        int diaNumero
) {
    public static RoteiroAtividadeResponse from(RoteiroAtividade roteiroAtividade) {
        return new RoteiroAtividadeResponse(
                roteiroAtividade.getAtividade().getId(),
                roteiroAtividade.getDiaNumero()
        );
    }
}

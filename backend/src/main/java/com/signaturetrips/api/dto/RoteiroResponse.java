package com.signaturetrips.api.dto;

import com.signaturetrips.api.domain.entity.Roteiro;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RoteiroResponse(
        Long id,
        DestinoResponse destino,
        LocalDate dataIda,
        LocalDate dataVolta,
        int totalDias,
        LocalDateTime criadoEm
) {
    public static RoteiroResponse from(Roteiro roteiro) {
        return new RoteiroResponse(
                roteiro.getId(),
                DestinoResponse.from(roteiro.getDestino()),
                roteiro.getDataIda(),
                roteiro.getDataVolta(),
                roteiro.calcularTotalDias(),
                roteiro.getCriadoEm()
        );
    }
}

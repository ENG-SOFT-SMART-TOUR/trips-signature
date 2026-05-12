package com.signaturetrips.api.dto;

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
) {}

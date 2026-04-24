package com.signaturetrips.api.dto;

import java.util.Set;

public record DestinoResponse(
        Long id,
        String nome,
        String descricao,
        String foto,
        String pais,
        String categoria,
        Set<String> tags
) {}

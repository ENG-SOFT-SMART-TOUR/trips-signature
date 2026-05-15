package com.signaturetrips.api.dto;

import com.signaturetrips.api.domain.entity.Destino;

import java.util.Set;

public record DestinoResponse(
        Long id,
        String nome,
        String descricao,
        String foto,
        String pais,
        String categoria,
        Set<String> tags
) {
    public static DestinoResponse from(Destino destino) {
        return new DestinoResponse(
                destino.getId(),
                destino.getNome(),
                destino.getDescricao(),
                destino.getFoto(),
                destino.getPais(),
                destino.getCategoria(),
                destino.getTags()
        );
    }
}

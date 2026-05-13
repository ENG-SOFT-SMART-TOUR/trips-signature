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
    public static DestinoResponse from(Destino d) {
        return new DestinoResponse(d.getId(), d.getNome(), d.getDescricao(), d.getFoto(), d.getPais(), d.getCategoria(), d.getTags());
    }
}

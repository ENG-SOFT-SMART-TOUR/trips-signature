package com.signaturetrips.api.service.mapper;

import com.signaturetrips.api.domain.entity.Destino;
import com.signaturetrips.api.dto.DestinoResponse;
import org.springframework.stereotype.Component;

@Component
public class DestinoMapper {

    public DestinoResponse toResponse(Destino destino) {
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

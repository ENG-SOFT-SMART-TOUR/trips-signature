package com.signaturetrips.api.service.mapper;

import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.dto.RoteiroResponse;
import org.springframework.stereotype.Component;

@Component
public class RoteiroMapper {

    private final DestinoMapper destinoMapper;

    public RoteiroMapper(DestinoMapper destinoMapper) {
        this.destinoMapper = destinoMapper;
    }

    public RoteiroResponse toResponse(Roteiro roteiro) {
        int totalDias = (int) (roteiro.getDataVolta().toEpochDay() - roteiro.getDataIda().toEpochDay()) + 1;
        return new RoteiroResponse(
                roteiro.getId(),
                destinoMapper.toResponse(roteiro.getDestino()),
                roteiro.getDataIda(),
                roteiro.getDataVolta(),
                totalDias,
                roteiro.getCriadoEm()
        );
    }
}

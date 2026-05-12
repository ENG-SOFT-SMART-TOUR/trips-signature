package com.signaturetrips.api.service.mapper;

import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.dto.RoteiroResponse;
import com.signaturetrips.api.service.calculator.RoteiroCalculator;
import org.springframework.stereotype.Component;

@Component
public class RoteiroMapper {

    private final DestinoMapper destinoMapper;
    private final RoteiroCalculator roteiroCalculator;

    public RoteiroMapper(DestinoMapper destinoMapper, RoteiroCalculator roteiroCalculator) {
        this.destinoMapper = destinoMapper;
        this.roteiroCalculator = roteiroCalculator;
    }

    public RoteiroResponse toResponse(Roteiro roteiro) {
        int totalDias = roteiroCalculator.calculateTotalDays(roteiro.getDataIda(), roteiro.getDataVolta());
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

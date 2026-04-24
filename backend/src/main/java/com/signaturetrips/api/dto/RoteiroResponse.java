package com.signaturetrips.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RoteiroResponse(
        Long id,
        DestinoResponse destino,
        LocalDate dataIda,
        LocalDate dataVolta,
        int totalDias,
        LocalDateTime criadoEm
) {}

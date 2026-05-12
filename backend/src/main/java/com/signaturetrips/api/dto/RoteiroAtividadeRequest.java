package com.signaturetrips.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RoteiroAtividadeRequest(
        @NotNull Long atividadeId,
        @Min(1) int diaNumero
) {}

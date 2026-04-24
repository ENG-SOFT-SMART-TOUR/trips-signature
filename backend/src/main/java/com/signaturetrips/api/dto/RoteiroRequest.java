package com.signaturetrips.api.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RoteiroRequest(
        @NotNull Long usuarioId,
        @NotNull Long destinoId,
        @NotNull LocalDate dataIda,
        @NotNull LocalDate dataVolta
) {}

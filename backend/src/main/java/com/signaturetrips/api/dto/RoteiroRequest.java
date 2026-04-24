package com.signaturetrips.api.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RoteiroRequest(
        @NotNull Long usuarioId,
        @NotNull Long destinoId,
        @NotNull @FutureOrPresent LocalDate dataIda,
        @NotNull LocalDate dataVolta
) {}

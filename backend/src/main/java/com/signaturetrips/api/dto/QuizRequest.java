package com.signaturetrips.api.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record QuizRequest(
        @NotNull Long usuarioId,
        @NotEmpty List<String> tags
) {}

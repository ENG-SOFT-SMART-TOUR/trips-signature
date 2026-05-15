package com.signaturetrips.api.dto;

import com.signaturetrips.api.domain.entity.Usuario;

public record LoginResponse(Long id, String nome, String email, boolean quizCompleto) {

    public static LoginResponse from(Usuario usuario) {
        return new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.isQuizCompleto()
        );
    }
}

package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioProfileService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioProfileService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public void updateProfileTags(Long usuarioId, List<String> tags) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        usuario.getTags().clear();
        usuario.getTags().addAll(tags);
        usuario.setQuizCompleto(true);
        usuarioRepository.save(usuario);
    }
}

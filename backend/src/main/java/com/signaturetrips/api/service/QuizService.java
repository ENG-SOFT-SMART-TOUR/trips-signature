package com.signaturetrips.api.service;

import com.signaturetrips.api.constant.QuizConstants;
import com.signaturetrips.api.dto.PerguntaDto;
import com.signaturetrips.api.dto.QuizRequest;
import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class QuizService {

    private final UsuarioRepository usuarioRepository;

    public QuizService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<PerguntaDto> getPerguntas() {
        return QuizConstants.PERGUNTAS;
    }

    public void salvarPerfil(QuizRequest request) {
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        usuario.getTags().clear();
        usuario.getTags().addAll(request.tags());
        usuario.setQuizCompleto(true);
        usuarioRepository.save(usuario);
    }
}

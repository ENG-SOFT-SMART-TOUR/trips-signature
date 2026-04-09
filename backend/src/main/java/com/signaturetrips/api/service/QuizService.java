package com.signaturetrips.api.service;

import com.signaturetrips.api.dto.OpcaoDto;
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

    private static final List<PerguntaDto> PERGUNTAS = List.of(
            new PerguntaDto(1, "Where do you feel most alive?", List.of(
                    new OpcaoDto("Beach", "beach"),
                    new OpcaoDto("Mountains", "mountains"),
                    new OpcaoDto("City", "city"),
                    new OpcaoDto("Countryside", "countryside")
            )),
            new PerguntaDto(2, "What moves your soul?", List.of(
                    new OpcaoDto("Adventure", "adventure"),
                    new OpcaoDto("Culture", "culture"),
                    new OpcaoDto("Relaxation", "relaxation"),
                    new OpcaoDto("Gastronomy", "gastronomy")
            )),
            new PerguntaDto(3, "Your comfort zone?", List.of(
                    new OpcaoDto("Budget", "budget"),
                    new OpcaoDto("Moderate", "moderate"),
                    new OpcaoDto("Comfortable", "comfortable"),
                    new OpcaoDto("Luxury", "luxury")
            )),
            new PerguntaDto(4, "Who shares the journey?", List.of(
                    new OpcaoDto("Solo", "solo"),
                    new OpcaoDto("Couple", "couple"),
                    new OpcaoDto("Family", "family"),
                    new OpcaoDto("Friends", "friends")
            )),
            new PerguntaDto(5, "Your rhythm of discovery?", List.of(
                    new OpcaoDto("Slow & deep", "slow"),
                    new OpcaoDto("Balanced", "balanced"),
                    new OpcaoDto("Fast & packed", "fast")
            ))
    );

    public List<PerguntaDto> getPerguntas() {
        return PERGUNTAS;
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

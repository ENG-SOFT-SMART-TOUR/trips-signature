package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
import com.signaturetrips.api.dto.QuizRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private QuizService quizService;

    @Test
    void getPerguntasRetornaAsCincoPerguntas() {
        assertEquals(5, quizService.getPerguntas().size());
    }

    @Test
    void salvarPerfilFalhaQuandoUsuarioNaoExiste() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        QuizRequest request = new QuizRequest(99L, List.of("beach"));
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> quizService.salvarPerfil(request));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void salvarPerfilSubstituiTagsEMarcaQuizCompleto() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setQuizCompleto(false);
        usuario.setTags(new HashSet<>(List.of("old-tag")));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        quizService.salvarPerfil(new QuizRequest(1L, List.of("beach", "luxury", "couple")));

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(captor.capture());
        Usuario salvo = captor.getValue();

        assertTrue(salvo.isQuizCompleto());
        assertEquals(3, salvo.getTags().size());
        assertTrue(salvo.getTags().contains("beach"));
        assertTrue(salvo.getTags().containsAll(List.of("beach", "luxury", "couple")));
    }
}

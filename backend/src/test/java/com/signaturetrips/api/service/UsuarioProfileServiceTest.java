package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
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
class UsuarioProfileServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioProfileService usuarioProfileService;

    private Usuario usuario;

    @BeforeEach
    void setup() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("test@example.com");
        usuario.setQuizCompleto(false);
        usuario.setTags(new HashSet<>(List.of("old-tag")));
    }

    @Test
    void updateProfileTagsThrowsWhenUserNotFound() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> usuarioProfileService.updateProfileTags(99L, List.of("beach")));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void updateProfileTagsReplacesTagsAndMarksQuizComplete() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        usuarioProfileService.updateProfileTags(1L, List.of("beach", "adventure", "luxury"));

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(captor.capture());
        Usuario saved = captor.getValue();

        assertTrue(saved.isQuizCompleto());
        assertEquals(3, saved.getTags().size());
        assertTrue(saved.getTags().contains("beach"));
        assertTrue(saved.getTags().contains("adventure"));
        assertTrue(saved.getTags().contains("luxury"));
    }
}

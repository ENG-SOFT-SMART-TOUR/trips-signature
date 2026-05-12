package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
import com.signaturetrips.api.dto.CadastroRequest;
import com.signaturetrips.api.dto.LoginRequest;
import com.signaturetrips.api.dto.LoginResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private BCryptPasswordEncoder encoder;

    @InjectMocks
    private AuthService authService;

    private Usuario existingUser;

    @BeforeEach
    void setup() {
        existingUser = new Usuario();
        existingUser.setId(1L);
        existingUser.setNome("Test");
        existingUser.setEmail("test@example.com");
        existingUser.setSenha("hashed");
        existingUser.setQuizCompleto(true);
    }

    @Test
    void cadastroFailsWhenEmailAlreadyExists() {
        when(usuarioRepository.existsByEmail("test@example.com")).thenReturn(true);

        CadastroRequest request = new CadastroRequest("Test", "test@example.com", "senha123");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.cadastrar(request));
        assertEquals(409, ex.getStatusCode().value());
    }

    @Test
    void cadastroPersistsHashedPassword() {
        when(usuarioRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(encoder.encode("senha123")).thenReturn("hashed-senha");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(42L);
            return u;
        });

        CadastroRequest request = new CadastroRequest("Novo", "new@example.com", "senha123");
        LoginResponse response = authService.cadastrar(request);

        assertNotNull(response);
        assertEquals(42L, response.id());
        assertEquals("new@example.com", response.email());
    }

    @Test
    void loginFailsWhenEmailNotFound() {
        when(usuarioRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest("missing@example.com", "senha");
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.login(request));
        assertEquals(401, ex.getStatusCode().value());
    }

    @Test
    void loginFailsWhenPasswordDoesNotMatch() {
        when(usuarioRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));
        when(encoder.matches("wrong", "hashed")).thenReturn(false);

        LoginRequest request = new LoginRequest("test@example.com", "wrong");
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.login(request));
        assertEquals(401, ex.getStatusCode().value());
    }

    @Test
    void loginSucceedsWithValidCredentials() {
        when(usuarioRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));
        when(encoder.matches("senha123", "hashed")).thenReturn(true);

        LoginRequest request = new LoginRequest("test@example.com", "senha123");
        LoginResponse response = authService.login(request);

        assertEquals(1L, response.id());
        assertEquals("test@example.com", response.email());
        assertEquals(true, response.quizCompleto());
    }
}

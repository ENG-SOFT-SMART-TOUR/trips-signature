package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Destino;
import com.signaturetrips.api.domain.entity.DestinoSalvo;
import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.DestinoRepository;
import com.signaturetrips.api.domain.repository.DestinoSalvoRepository;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
import com.signaturetrips.api.dto.DestinoResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DestinoServiceTest {

    @Mock
    private DestinoRepository destinoRepository;

    @Mock
    private DestinoSalvoRepository destinoSalvoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private DestinoService destinoService;

    private Usuario usuario;
    private Destino destino;

    @BeforeEach
    void setup() {
        usuario = new Usuario();
        usuario.setId(1L);

        destino = new Destino();
        destino.setId(10L);
        destino.setNome("Florianópolis");
        destino.setDescricao("Ilha");
        destino.setFoto("foto.jpg");
        destino.setPais("Brasil");
        destino.setCategoria("beach");
        destino.setTags(Set.of("beach"));
    }

    @Test
    void listarTodosMapeiaParaDto() {
        when(destinoRepository.findAll()).thenReturn(List.of(destino));

        List<DestinoResponse> resultado = destinoService.listarTodos();

        assertEquals(1, resultado.size());
        assertEquals("Florianópolis", resultado.get(0).nome());
        assertEquals(10L, resultado.get(0).id());
    }

    @Test
    void listarSalvosFalhaQuandoUsuarioNaoExiste() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> destinoService.listarSalvos(99L));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void listarSalvosMapeiaDestinosSalvos() {
        DestinoSalvo salvo = new DestinoSalvo();
        salvo.setUsuario(usuario);
        salvo.setDestino(destino);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(destinoSalvoRepository.findByUsuario(usuario)).thenReturn(List.of(salvo));

        List<DestinoResponse> resultado = destinoService.listarSalvos(1L);

        assertEquals(1, resultado.size());
        assertEquals(10L, resultado.get(0).id());
    }

    @Test
    void salvarFalhaQuandoDestinoNaoExiste() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(destinoRepository.findById(10L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> destinoService.salvar(1L, 10L));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void salvarPersisteQuandoAindaNaoSalvo() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(destinoRepository.findById(10L)).thenReturn(Optional.of(destino));
        when(destinoSalvoRepository.existsByUsuarioAndDestino(usuario, destino)).thenReturn(false);

        destinoService.salvar(1L, 10L);

        verify(destinoSalvoRepository).save(any(DestinoSalvo.class));
    }

    @Test
    void salvarNaoDuplicaQuandoJaSalvo() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(destinoRepository.findById(10L)).thenReturn(Optional.of(destino));
        when(destinoSalvoRepository.existsByUsuarioAndDestino(usuario, destino)).thenReturn(true);

        destinoService.salvar(1L, 10L);

        verify(destinoSalvoRepository, never()).save(any(DestinoSalvo.class));
    }

    @Test
    void removerDeletaQuandoExiste() {
        DestinoSalvo salvo = new DestinoSalvo();
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(destinoRepository.findById(10L)).thenReturn(Optional.of(destino));
        when(destinoSalvoRepository.findByUsuarioAndDestino(usuario, destino)).thenReturn(Optional.of(salvo));

        destinoService.remover(1L, 10L);

        verify(destinoSalvoRepository).delete(salvo);
    }
}

package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Destino;
import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.DestinoRepository;
import com.signaturetrips.api.domain.repository.RoteiroRepository;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
import com.signaturetrips.api.dto.RoteiroRequest;
import com.signaturetrips.api.dto.RoteiroResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoteiroServiceTest {

    @Mock
    private RoteiroRepository roteiroRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private DestinoRepository destinoRepository;

    @InjectMocks
    private RoteiroService roteiroService;

    private Usuario usuario;
    private Destino destino;

    @BeforeEach
    void setup() {
        usuario = new Usuario();
        usuario.setId(1L);

        destino = new Destino();
        destino.setId(10L);
        destino.setNome("Gramado");
        destino.setPais("Brasil");
        destino.setTags(Set.of("mountains"));
    }

    @Test
    void criarRejeitaDataVoltaAntesOuIgualDataIda() {
        RoteiroRequest request = new RoteiroRequest(1L, 10L,
                LocalDate.of(2026, 6, 10), LocalDate.of(2026, 6, 10));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> roteiroService.criar(request));
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void criarFalhaQuandoUsuarioNaoExiste() {
        RoteiroRequest request = new RoteiroRequest(99L, 10L,
                LocalDate.of(2026, 6, 10), LocalDate.of(2026, 6, 17));
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> roteiroService.criar(request));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void criarFalhaQuandoDestinoNaoExiste() {
        RoteiroRequest request = new RoteiroRequest(1L, 10L,
                LocalDate.of(2026, 6, 10), LocalDate.of(2026, 6, 17));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(destinoRepository.findById(10L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> roteiroService.criar(request));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void criarSucedeNoCaminhoFeliz() {
        RoteiroRequest request = new RoteiroRequest(1L, 10L,
                LocalDate.of(2026, 6, 10), LocalDate.of(2026, 6, 17));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(destinoRepository.findById(10L)).thenReturn(Optional.of(destino));
        when(roteiroRepository.save(any(Roteiro.class))).thenAnswer(invocation -> {
            Roteiro r = invocation.getArgument(0);
            r.setId(5L);
            return r;
        });

        RoteiroResponse response = roteiroService.criar(request);

        assertEquals(5L, response.id());
        assertEquals(10L, response.destino().id());
        assertEquals(8, response.totalDias());
    }

    @Test
    void buscarPorIdFalhaQuandoNaoExiste() {
        when(roteiroRepository.findWithAssociacoesById(5L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> roteiroService.buscarPorId(5L));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void deletarRejeitaUsuarioQueNaoEhDono() {
        Roteiro roteiro = new Roteiro();
        roteiro.setId(5L);
        roteiro.setUsuario(usuario);
        when(roteiroRepository.findWithAssociacoesById(5L)).thenReturn(Optional.of(roteiro));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> roteiroService.deletar(5L, 99L));
        assertEquals(403, ex.getStatusCode().value());
    }

    @Test
    void deletarSucedeQuandoDono() {
        Roteiro roteiro = new Roteiro();
        roteiro.setId(5L);
        roteiro.setUsuario(usuario);
        when(roteiroRepository.findWithAssociacoesById(5L)).thenReturn(Optional.of(roteiro));

        roteiroService.deletar(5L, 1L);

        verify(roteiroRepository).delete(roteiro);
    }
}

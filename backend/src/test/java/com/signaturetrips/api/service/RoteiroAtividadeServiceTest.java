package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Atividade;
import com.signaturetrips.api.domain.entity.Destino;
import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.domain.entity.RoteiroAtividade;
import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.AtividadeRepository;
import com.signaturetrips.api.domain.repository.RoteiroAtividadeRepository;
import com.signaturetrips.api.domain.repository.RoteiroRepository;
import com.signaturetrips.api.dto.RoteiroAtividadeRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoteiroAtividadeServiceTest {

    @Mock
    private RoteiroRepository roteiroRepository;

    @Mock
    private AtividadeRepository atividadeRepository;

    @Mock
    private RoteiroAtividadeRepository roteiroAtividadeRepository;

    @InjectMocks
    private RoteiroAtividadeService service;

    private static final Long OWNER_ID = 1L;
    private static final Long OTHER_USER_ID = 99L;
    private static final Long ROTEIRO_ID = 10L;
    private static final Long DESTINO_ID = 5L;

    private Roteiro roteiro;
    private Atividade atividade;

    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(service, "maxAtividadesPorDia", 5);

        Usuario owner = new Usuario();
        owner.setId(OWNER_ID);

        Destino destino = new Destino();
        destino.setId(DESTINO_ID);

        roteiro = new Roteiro();
        roteiro.setId(ROTEIRO_ID);
        roteiro.setUsuario(owner);
        roteiro.setDestino(destino);
        roteiro.setDataIda(LocalDate.of(2026, 6, 10));
        roteiro.setDataVolta(LocalDate.of(2026, 6, 16)); // 7 dias

        atividade = new Atividade();
        atividade.setId(100L);
        atividade.setDestino(destino);
    }

    @Test
    void adicionarRejeitaUsuarioQueNaoEhDono() {
        when(roteiroRepository.findWithAssociacoesById(ROTEIRO_ID)).thenReturn(Optional.of(roteiro));

        RoteiroAtividadeRequest request = new RoteiroAtividadeRequest(100L, 1);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.adicionar(ROTEIRO_ID, OTHER_USER_ID, request));
        assertEquals(403, ex.getStatusCode().value());
    }

    @Test
    void removerRejeitaUsuarioQueNaoEhDono() {
        when(roteiroRepository.findWithAssociacoesById(ROTEIRO_ID)).thenReturn(Optional.of(roteiro));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.remover(ROTEIRO_ID, OTHER_USER_ID, 100L, 1));
        assertEquals(403, ex.getStatusCode().value());
    }

    @Test
    void listarRejeitaUsuarioQueNaoEhDono() {
        when(roteiroRepository.findWithAssociacoesById(ROTEIRO_ID)).thenReturn(Optional.of(roteiro));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.listar(ROTEIRO_ID, OTHER_USER_ID));
        assertEquals(403, ex.getStatusCode().value());
    }

    @Test
    void adicionarBloqueiaSextaAtividadeNoDia() {
        when(roteiroRepository.findWithAssociacoesById(ROTEIRO_ID)).thenReturn(Optional.of(roteiro));
        when(roteiroAtividadeRepository.countByRoteiroIdAndDiaNumero(ROTEIRO_ID, 1)).thenReturn(5);

        RoteiroAtividadeRequest request = new RoteiroAtividadeRequest(100L, 1);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.adicionar(ROTEIRO_ID, OWNER_ID, request));
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void adicionarRejeitaDiaForaDoIntervalo() {
        when(roteiroRepository.findWithAssociacoesById(ROTEIRO_ID)).thenReturn(Optional.of(roteiro));

        RoteiroAtividadeRequest request = new RoteiroAtividadeRequest(100L, 99);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.adicionar(ROTEIRO_ID, OWNER_ID, request));
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void adicionarRejeitaAtividadeDuplicadaNoMesmoDia() {
        when(roteiroRepository.findWithAssociacoesById(ROTEIRO_ID)).thenReturn(Optional.of(roteiro));
        when(roteiroAtividadeRepository.countByRoteiroIdAndDiaNumero(ROTEIRO_ID, 1)).thenReturn(2);
        when(atividadeRepository.findById(100L)).thenReturn(Optional.of(atividade));
        when(roteiroAtividadeRepository.findByRoteiroIdAndAtividadeIdAndDiaNumero(ROTEIRO_ID, 100L, 1))
                .thenReturn(Optional.of(new RoteiroAtividade()));

        RoteiroAtividadeRequest request = new RoteiroAtividadeRequest(100L, 1);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.adicionar(ROTEIRO_ID, OWNER_ID, request));
        assertEquals(409, ex.getStatusCode().value());
    }

    @Test
    void adicionarSucedeNoCaminhoFeliz() {
        when(roteiroRepository.findWithAssociacoesById(ROTEIRO_ID)).thenReturn(Optional.of(roteiro));
        when(roteiroAtividadeRepository.countByRoteiroIdAndDiaNumero(ROTEIRO_ID, 1)).thenReturn(0);
        when(atividadeRepository.findById(100L)).thenReturn(Optional.of(atividade));
        when(roteiroAtividadeRepository.findByRoteiroIdAndAtividadeIdAndDiaNumero(ROTEIRO_ID, 100L, 1))
                .thenReturn(Optional.empty());
        lenient().when(roteiroAtividadeRepository.save(any(RoteiroAtividade.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RoteiroAtividadeRequest request = new RoteiroAtividadeRequest(100L, 1);

        assertDoesNotThrow(() -> service.adicionar(ROTEIRO_ID, OWNER_ID, request));
    }
}

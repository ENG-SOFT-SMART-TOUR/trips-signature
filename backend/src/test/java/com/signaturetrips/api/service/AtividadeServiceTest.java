package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Atividade;
import com.signaturetrips.api.domain.repository.AtividadeRepository;
import com.signaturetrips.api.domain.repository.DestinoRepository;
import com.signaturetrips.api.dto.AtividadeResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AtividadeServiceTest {

    @Mock
    private AtividadeRepository atividadeRepository;

    @Mock
    private DestinoRepository destinoRepository;

    @InjectMocks
    private AtividadeService atividadeService;

    private Atividade atividade;

    @BeforeEach
    void setup() {
        atividade = new Atividade();
        atividade.setId(100L);
        atividade.setNome("Surf Lesson");
        atividade.setCategoria("Adventure");
        atividade.setDuracao("3h");
        atividade.setTurno("morning");
        atividade.setDescricao("Aula de surf");
        atividade.setFoto("foto.jpg");
    }

    @Test
    void listarPorDestinoFalhaQuandoDestinoNaoExiste() {
        when(destinoRepository.existsById(99L)).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> atividadeService.listarPorDestino(99L, null));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void listarPorDestinoSemTurnoUsaListagemCompleta() {
        when(destinoRepository.existsById(10L)).thenReturn(true);
        when(atividadeRepository.findByDestinoId(10L)).thenReturn(List.of(atividade));

        List<AtividadeResponse> resultado = atividadeService.listarPorDestino(10L, null);

        assertEquals(1, resultado.size());
        assertEquals("Surf Lesson", resultado.get(0).nome());
        verify(atividadeRepository, never()).findByDestinoIdAndTurnoIgnoreCase(10L, null);
    }

    @Test
    void listarPorDestinoComTurnoEmBrancoUsaListagemCompleta() {
        when(destinoRepository.existsById(10L)).thenReturn(true);
        when(atividadeRepository.findByDestinoId(10L)).thenReturn(List.of(atividade));

        atividadeService.listarPorDestino(10L, "   ");

        verify(atividadeRepository).findByDestinoId(10L);
    }

    @Test
    void listarPorDestinoComTurnoFiltraPorTurno() {
        when(destinoRepository.existsById(10L)).thenReturn(true);
        when(atividadeRepository.findByDestinoIdAndTurnoIgnoreCase(10L, "morning"))
                .thenReturn(List.of(atividade));

        List<AtividadeResponse> resultado = atividadeService.listarPorDestino(10L, " morning ");

        assertEquals(1, resultado.size());
        assertEquals("morning", resultado.get(0).turno());
        verify(atividadeRepository, never()).findByDestinoId(10L);
    }
}

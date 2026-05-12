package com.signaturetrips.api.controller;

import com.signaturetrips.api.dto.AtividadeResponse;
import com.signaturetrips.api.service.AtividadeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atividades")
public class AtividadeController {

    private final AtividadeService atividadeService;

    public AtividadeController(AtividadeService atividadeService) {
        this.atividadeService = atividadeService;
    }

    @GetMapping("/destino/{destinoId}")
    public ResponseEntity<List<AtividadeResponse>> listarPorDestino(@PathVariable Long destinoId) {
        return ResponseEntity.ok(atividadeService.listarPorDestino(destinoId));
    }
}

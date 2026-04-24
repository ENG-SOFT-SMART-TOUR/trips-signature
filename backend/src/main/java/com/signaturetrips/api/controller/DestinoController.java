package com.signaturetrips.api.controller;

import com.signaturetrips.api.dto.DestinoResponse;
import com.signaturetrips.api.service.DestinoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinos")
public class DestinoController {

    private final DestinoService destinoService;

    public DestinoController(DestinoService destinoService) {
        this.destinoService = destinoService;
    }

    @GetMapping
    public ResponseEntity<List<DestinoResponse>> listarTodos() {
        return ResponseEntity.ok(destinoService.listarTodos());
    }

    @GetMapping("/salvos/{usuarioId}")
    public ResponseEntity<List<DestinoResponse>> listarSalvos(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(destinoService.listarSalvos(usuarioId));
    }

    @PostMapping("/{destinoId}/salvar/{usuarioId}")
    public ResponseEntity<Void> salvar(@PathVariable Long destinoId, @PathVariable Long usuarioId) {
        destinoService.salvar(usuarioId, destinoId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{destinoId}/salvar/{usuarioId}")
    public ResponseEntity<Void> remover(@PathVariable Long destinoId, @PathVariable Long usuarioId) {
        destinoService.remover(usuarioId, destinoId);
        return ResponseEntity.ok().build();
    }
}

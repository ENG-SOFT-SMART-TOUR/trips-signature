package com.signaturetrips.api.controller;

import com.signaturetrips.api.dto.RoteiroRequest;
import com.signaturetrips.api.dto.RoteiroResponse;
import com.signaturetrips.api.service.RoteiroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roteiros")
public class RoteiroController {

    private final RoteiroService roteiroService;

    public RoteiroController(RoteiroService roteiroService) {
        this.roteiroService = roteiroService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoteiroResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(roteiroService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<RoteiroResponse> criar(@Valid @RequestBody RoteiroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roteiroService.criar(request));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<RoteiroResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(roteiroService.listarPorUsuario(usuarioId));
    }

    @DeleteMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, @PathVariable Long usuarioId) {
        roteiroService.deletar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}

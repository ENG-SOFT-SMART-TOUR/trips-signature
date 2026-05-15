package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Destino;
import com.signaturetrips.api.domain.entity.DestinoSalvo;
import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.DestinoRepository;
import com.signaturetrips.api.domain.repository.DestinoSalvoRepository;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
import com.signaturetrips.api.dto.DestinoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DestinoService {

    private final DestinoRepository destinoRepository;
    private final DestinoSalvoRepository destinoSalvoRepository;
    private final UsuarioRepository usuarioRepository;

    public DestinoService(DestinoRepository destinoRepository,
                          DestinoSalvoRepository destinoSalvoRepository,
                          UsuarioRepository usuarioRepository) {
        this.destinoRepository = destinoRepository;
        this.destinoSalvoRepository = destinoSalvoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<DestinoResponse> listarTodos() {
        return destinoRepository.findAll().stream()
                .map(DestinoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DestinoResponse> listarSalvos(Long usuarioId) {
        Usuario usuario = buscarUsuario(usuarioId);
        return destinoSalvoRepository.findByUsuario(usuario).stream()
                .map(destinoSalvo -> DestinoResponse.from(destinoSalvo.getDestino()))
                .toList();
    }

    @Transactional
    public void salvar(Long usuarioId, Long destinoId) {
        Usuario usuario = buscarUsuario(usuarioId);
        Destino destino = buscarDestino(destinoId);
        if (!destinoSalvoRepository.existsByUsuarioAndDestino(usuario, destino)) {
            DestinoSalvo salvo = new DestinoSalvo();
            salvo.setUsuario(usuario);
            salvo.setDestino(destino);
            destinoSalvoRepository.save(salvo);
        }
    }

    @Transactional
    public void remover(Long usuarioId, Long destinoId) {
        Usuario usuario = buscarUsuario(usuarioId);
        Destino destino = buscarDestino(destinoId);
        destinoSalvoRepository.findByUsuarioAndDestino(usuario, destino)
                .ifPresent(destinoSalvoRepository::delete);
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private Destino buscarDestino(Long id) {
        return destinoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destino não encontrado"));
    }
}

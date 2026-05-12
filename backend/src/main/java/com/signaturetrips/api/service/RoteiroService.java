package com.signaturetrips.api.service;

import com.signaturetrips.api.domain.entity.Destino;
import com.signaturetrips.api.domain.entity.Roteiro;
import com.signaturetrips.api.domain.entity.Usuario;
import com.signaturetrips.api.domain.repository.DestinoRepository;
import com.signaturetrips.api.domain.repository.RoteiroRepository;
import com.signaturetrips.api.domain.repository.UsuarioRepository;
import com.signaturetrips.api.dto.RoteiroRequest;
import com.signaturetrips.api.dto.RoteiroResponse;
import com.signaturetrips.api.service.mapper.RoteiroMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RoteiroService {

    private final RoteiroRepository roteiroRepository;
    private final UsuarioRepository usuarioRepository;
    private final DestinoRepository destinoRepository;
    private final RoteiroMapper roteiroMapper;

    public RoteiroService(RoteiroRepository roteiroRepository,
                          UsuarioRepository usuarioRepository,
                          DestinoRepository destinoRepository,
                          RoteiroMapper roteiroMapper) {
        this.roteiroRepository = roteiroRepository;
        this.usuarioRepository = usuarioRepository;
        this.destinoRepository = destinoRepository;
        this.roteiroMapper = roteiroMapper;
    }

    @Transactional
    public RoteiroResponse criar(RoteiroRequest request) {
        if (!request.dataVolta().isAfter(request.dataIda())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data de volta deve ser após a data de ida");
        }

        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Destino destino = destinoRepository.findById(request.destinoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destino não encontrado"));

        Roteiro roteiro = new Roteiro();
        roteiro.setUsuario(usuario);
        roteiro.setDestino(destino);
        roteiro.setDataIda(request.dataIda());
        roteiro.setDataVolta(request.dataVolta());

        Roteiro salvo = roteiroRepository.save(roteiro);
        return roteiroMapper.toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public RoteiroResponse buscarPorId(Long id) {
        Roteiro roteiro = roteiroRepository.findWithAssociacoesById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Roteiro não encontrado"));
        return roteiroMapper.toResponse(roteiro);
    }

    @Transactional(readOnly = true)
    public List<RoteiroResponse> listarPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return roteiroRepository.findByUsuarioOrderByCriadoEmDesc(usuario).stream()
                .map(roteiroMapper::toResponse)
                .toList();
    }

    @Transactional
    public void deletar(Long roteiroId, Long usuarioId) {
        Roteiro roteiro = roteiroRepository.findWithAssociacoesById(roteiroId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Roteiro não encontrado"));

        if (!roteiro.getUsuario().getId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        roteiroRepository.delete(roteiro);
    }
}

package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Agencia;
import iff.tcc.preliminar.entity.Gerente;
import iff.tcc.preliminar.entity.dto.GerenteDTO;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.exception.NaoPermitidoException;
import iff.tcc.preliminar.exception.RegistroInvalidoException;
import iff.tcc.preliminar.repository.AgenciaRepository;
import iff.tcc.preliminar.repository.GerenteRepository;
import iff.tcc.preliminar.utils.RegistroUtil;
import iff.tcc.preliminar.utils.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GerenteService {

    private final GerenteRepository gerenteRepository;
    private final RegistroUtil registroUtil;
    private final AgenciaRepository agenciaRepository;
    private final TokenUtil tokenUtil;

    public List<Gerente> findAll() {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return gerenteRepository.findAll();
    }

    public Gerente findById(UUID id) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return gerenteRepository.findById(id).orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado!"));
    }

    public Gerente save(GerenteDTO gerente) {
        if (gerenteRepository.existsByCpfOrEmail(gerente.getCpf(), gerente.getEmail())) {
            throw new RegistroInvalidoException("CPF ou email já cadastrado!");
        }

        var agencia = getAgencia(gerente.getIdAgencia());
        return gerenteRepository.save(registroUtil.formatarNovoGerente(gerente, agencia));
    }

    public Gerente update(UUID id, GerenteDTO novoGerente) {
        var gerente = findById(id);

        if (novoGerente.getIdAgencia() != gerente.getAgencia().getId()) {
            var agencia = getAgencia(novoGerente.getIdAgencia());
            return gerenteRepository.save(registroUtil.formatarAtualizarGerente(gerente, novoGerente, agencia));
        }
        return gerenteRepository.save(registroUtil.formatarAtualizarGerente(gerente, novoGerente, null));
    }

    public void delete(UUID id) {
        Gerente gerente = findById(id);
        gerenteRepository.delete(gerente);
    }

    private Agencia getAgencia(UUID agenciaId) {
        if (agenciaId == null) {
            throw new RegistroInvalidoException("O id da agência é obrigatório!");
        }

        return agenciaRepository.findById(agenciaId)
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada!"));
    }
}
package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Gerente;
import iff.tcc.ajustado.entity.dto.GerenteDTO;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.exception.RegistroInvalidoException;
import iff.tcc.ajustado.repository.AgenciaRepository;
import iff.tcc.ajustado.repository.GerenteRepository;
import iff.tcc.ajustado.utils.RegistroUtils;
import iff.tcc.ajustado.utils.TokenUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class GerenteService {

    @Inject
    GerenteRepository gerenteRepository;

    @Inject
    TokenUtil tokenUtil;

    @Inject
    AgenciaRepository agenciaRepository;

    public List<Gerente> listar() {
        return gerenteRepository.listAll();
    }

    public Gerente buscarPorId(UUID id) {
        return gerenteRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Gerente não encontrado!"));
    }

    @Transactional
    public void salvar(GerenteDTO gerente) {
        if (gerenteRepository.existsByCpfOrEmail(gerente.getCpf(), gerente.getEmail())) {
            throw new RegistroInvalidoException("CPF ou email já cadastrado!");
        }

        var agencia = agenciaRepository.findByIdOptional(gerente.getIdAgencia())
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada!"));

        gerenteRepository.persist(RegistroUtils.formatarNovoGerente(gerente, agencia));
    }


    @Transactional
    public Gerente atualizar(UUID id, GerenteDTO gerente) {
        var gerenteEntity = buscarPorId(id);

        if (gerenteRepository.existsByCpfOrEmail(gerente.getCpf(), gerente.getEmail())) {
            throw new RegistroInvalidoException("CPF ou email já cadastrado!");
        }

        var agencia = agenciaRepository.findByIdOptional(gerente.getIdAgencia())
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada!"));

        RegistroUtils.formatarAtualizarGerente(gerenteEntity, gerente, agencia);
        gerenteRepository.persist(gerenteEntity);
        return gerenteEntity;
    }

    @Transactional
    public void delete(UUID id) {
        Gerente gerente = buscarPorId(id);
        gerenteRepository.delete(gerente);
    }
}

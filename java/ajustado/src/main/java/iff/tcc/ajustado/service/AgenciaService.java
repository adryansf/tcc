package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Agencia;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.repository.AgenciaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AgenciaService {

    @Inject
    AgenciaRepository agenciaRepository;

    public List<Agencia> listar() {
        return agenciaRepository.listAll();
    }

    public Agencia buscarPorId(UUID id) {
        return agenciaRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada"));
    }

    @Transactional
    public void salvar(Agencia agencia) {
        agenciaRepository.persist(agencia);
    }


    @Transactional
    public Agencia atualizar(UUID id, Agencia agencia) {
        validarAgencia(agencia);
        Agencia agenciaSalva = buscarPorId(id);
        agenciaSalva.setNome(agencia.getNome());
        agenciaSalva.setTelefone(agencia.getTelefone());
        agenciaSalva.setNumero(agencia.getNumero());
        agenciaRepository.persist(agenciaSalva);
        return agenciaSalva;
    }

    @Transactional
    public void deletar(UUID id) {
        Agencia agencia = buscarPorId(id);
        agenciaRepository.delete(agencia);
    }

    private void validarAgencia(Agencia agencia) {
        if (StringUtils.isEmpty(agencia.getNome())) {
            throw new IllegalArgumentException("Nome da agência é obrigatório");
        }
        if (StringUtils.isEmpty(agencia.getTelefone())) {
            throw new IllegalArgumentException("Telefone da agência é obrigatório");
        }
        if (StringUtils.isEmpty(agencia.getNumero())) {
            throw new IllegalArgumentException("Número da agência é obrigatório");
        }
    }
}

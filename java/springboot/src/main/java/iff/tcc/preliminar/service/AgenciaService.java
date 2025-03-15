package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Agencia;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.exception.NaoPermitidoException;
import iff.tcc.preliminar.repository.AgenciaRepository;
import iff.tcc.preliminar.utils.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AgenciaService {

    private final AgenciaRepository agenciaRepository;
    private final TokenUtil tokenUtil;

    public List<Agencia> findAll() {
        return agenciaRepository.findAll();
    }

    public Agencia findById(UUID id) {
        return agenciaRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada"));
    }

    public Agencia save(Agencia agencia) {
        validarAgencia(agencia);
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return agenciaRepository.save(agencia);
    }

    public Agencia update(UUID id, Agencia agencia) {
        validarAgencia(agencia);
        Agencia existingAgencia = findById(id);
        existingAgencia.setNome(agencia.getNome());
        existingAgencia.setTelefone(agencia.getTelefone());
        existingAgencia.setNumero(agencia.getNumero());
        return agenciaRepository.save(existingAgencia);
    }

    public void delete(UUID id) {
        Agencia agencia = findById(id);
        agenciaRepository.delete(agencia);
    }

    private void validarAgencia(Agencia agencia) {
        if (StringUtils.isEmpty(agencia.getNome())) {
            throw new IllegalArgumentException("Nome da agência é obrigatório");
        }
        if (StringUtils.isEmpty(agencia.getTelefone())) {
            throw new IllegalArgumentException("Telefone da agência é obrigatório");
        }
    }
}
package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Agencia;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.repository.AgenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AgenciaService {

    private final AgenciaRepository agenciaRepository;

    public List<Agencia> findAll() {
        return agenciaRepository.findAll();
    }

    public Agencia findById(UUID id) {
        return agenciaRepository.findById(id).orElseThrow(() -> new NaoEncontradoException(""));
    }

    public Agencia save(Agencia agencia) {
        return agenciaRepository.save(agencia);
    }

    public Agencia update(UUID id, Agencia agencia) {
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
}
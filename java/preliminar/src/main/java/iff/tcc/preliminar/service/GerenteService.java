package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Gerente;
import iff.tcc.preliminar.entity.dto.LoginDTO;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.repository.GerenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GerenteService {

    private final GerenteRepository gerenteRepository;

    public List<Gerente> findAll() {
        return gerenteRepository.findAll();
    }

    public Gerente findById(UUID id) {
        return gerenteRepository.findById(id).orElseThrow(() -> new NaoEncontradoException(""));
    }

    public Gerente save(Gerente gerente) {
        return gerenteRepository.save(gerente);
    }

    public Gerente update(UUID id, Gerente gerente) {
        Gerente existingGerente = findById(id);
        existingGerente.setNome(gerente.getNome());
        existingGerente.setEmail(gerente.getEmail());
        existingGerente.setTelefone(gerente.getTelefone());
        return gerenteRepository.save(existingGerente);
    }

    public void delete(UUID id) {
        Gerente gerente = findById(id);
        gerenteRepository.delete(gerente);
    }

    public Gerente autorizarGerente(LoginDTO loginDTO) {
        return gerenteRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new NaoEncontradoException("Gerente não encontrado"));
    }
}
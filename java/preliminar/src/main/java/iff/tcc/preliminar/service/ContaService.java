package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Conta;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.repository.ContaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository contaRepository;

    public List<Conta> findAll() {
        return contaRepository.findAll();
    }

    public Conta findById(UUID id) {
        return contaRepository.findById(id).orElseThrow(() -> new NaoEncontradoException(""));
    }

    public Conta save(Conta conta) {
        return contaRepository.save(conta);
    }

    public Conta update(UUID id, Conta conta) {
        Conta existingConta = findById(id);
        existingConta.setNumero(conta.getNumero());
        existingConta.setSaldo(conta.getSaldo());
        return contaRepository.save(existingConta);
    }

    public void delete(UUID id) {
        Conta conta = findById(id);
        contaRepository.delete(conta);
    }
}
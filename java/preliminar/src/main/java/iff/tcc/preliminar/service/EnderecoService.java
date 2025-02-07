package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Endereco;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.repository.EnderecoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    public List<Endereco> findAll() {
        return enderecoRepository.findAll();
    }

    public Endereco findById(UUID id) {
        return enderecoRepository.findById(id).orElseThrow(() -> new NaoEncontradoException(""));
    }

    public Endereco save(Endereco endereco) {
        return enderecoRepository.save(endereco);
    }

    public Endereco update(UUID id, Endereco endereco) {
        Endereco existingEndereco = findById(id);
        existingEndereco.setLogradouro(endereco.getLogradouro());
        existingEndereco.setNumero(endereco.getNumero());
        existingEndereco.setComplemento(endereco.getComplemento());
        existingEndereco.setBairro(endereco.getBairro());
        existingEndereco.setCidade(endereco.getCidade());
        existingEndereco.setUf(endereco.getUf());
        existingEndereco.setCep(endereco.getCep());
        existingEndereco.setCliente(endereco.getCliente());
        return enderecoRepository.save(existingEndereco);
    }

    public void delete(UUID id) {
        Endereco endereco = findById(id);
        enderecoRepository.delete(endereco);
    }
}
package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ClienteService {

    private ClienteRepository clienteRepository;

    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Cliente findById(UUID id) {
        return clienteRepository.findById(id).orElseThrow(() -> new NaoEncontradoException(""));
    }

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Cliente update(UUID id, Cliente cliente) {
        Cliente existingCliente = findById(id);
        existingCliente.setNome(cliente.getNome());
        existingCliente.setEmail(cliente.getEmail());
        existingCliente.setTelefone(cliente.getTelefone());
        return clienteRepository.save(existingCliente);
    }

    public void delete(UUID id) {
        Cliente cliente = findById(id);
        clienteRepository.delete(cliente);
    }
}
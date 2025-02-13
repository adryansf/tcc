package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.repository.ClienteRepository;
import iff.tcc.ajustado.utils.RegistroUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class ClienteService {

    @Inject
    ClienteRepository clienteRepository;

    public Cliente buscarPorId(UUID id) {
        return clienteRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado"));
    }

    @Transactional
    public Cliente criar(Cliente cliente) {
        var novoCliente = RegistroUtils.formatarNovoCliente(cliente);
        clienteRepository.persist(novoCliente);
        return novoCliente;
    }
}

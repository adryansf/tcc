package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.exception.NaoPermitidoException;
import iff.tcc.ajustado.exception.RegistroInvalidoException;
import iff.tcc.ajustado.repository.ClienteRepository;
import iff.tcc.ajustado.utils.RegistroUtils;
import iff.tcc.ajustado.utils.TokenUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ClienteService {

    @Inject
    ClienteRepository clienteRepository;

    @Inject
    TokenUtil tokenUtil;

    public List<Cliente> listar() {
        return clienteRepository.listAll();
    }

    public Cliente buscarPorId(UUID id) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(id)) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return clienteRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado"));
    }

    @Transactional
    public Cliente criar(Cliente cliente) {
        if (clienteRepository.existsByEmailOrCpf(cliente.getEmail(), cliente.getCpf())) {
            throw new RegistroInvalidoException("Já existe um cliente com esse email ou cpf");
        }

        var novoCliente = RegistroUtils.formatarNovoCliente(cliente);
        clienteRepository.persist(novoCliente);
        return novoCliente;
    }

    public Cliente update(UUID id, Cliente cliente) {
        Cliente clienteExistente = buscarPorId(id);

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(id)) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        var novoCliente = RegistroUtils.formatarAtualizarCliente(clienteExistente, cliente);
        clienteRepository.persist(novoCliente);
        return novoCliente;
    }

    public void delete(UUID id) {
        Cliente cliente = buscarPorId(id);
        clienteRepository.delete(cliente);
    }
}

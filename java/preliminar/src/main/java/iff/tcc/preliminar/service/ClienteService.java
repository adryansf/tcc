package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.exception.NaoPermitidoException;
import iff.tcc.preliminar.exception.RegistroInvalidoException;
import iff.tcc.preliminar.repository.ClienteRepository;
import iff.tcc.preliminar.utils.RegistroUtil;
import iff.tcc.preliminar.utils.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final TokenUtil tokenUtil;
    private final RegistroUtil registroUtil;

    public List<Cliente> findAll() {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return clienteRepository.findAll();
    }

    public Cliente findById(UUID id) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(id)) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return clienteRepository.findById(id).orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado!"));
    }

    public Cliente save(Cliente cliente) {
        if (clienteRepository.existsByEmailOrCpf(cliente.getEmail(), cliente.getCpf())) {
            throw new RegistroInvalidoException("Já existe um cliente com esse email ou cpf");
        }

        return clienteRepository.save(registroUtil.formatarNovoCliente(cliente));
    }

    public Cliente update(UUID id, Cliente cliente) {
        Cliente clienteExistente = findById(id);

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(id)) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return clienteRepository.save(registroUtil.formatarAtualizarCliente(clienteExistente, cliente));
    }

    public void delete(UUID id) {
        Cliente cliente = findById(id);
        clienteRepository.delete(cliente);
    }
}
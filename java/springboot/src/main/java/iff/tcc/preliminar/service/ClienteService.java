package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Endereco;
import iff.tcc.preliminar.entity.dto.ClienteComEnderecoDTO;
import iff.tcc.preliminar.entity.dto.EnderecoDTO;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.exception.NaoPermitidoException;
import iff.tcc.preliminar.exception.RegistroInvalidoException;
import iff.tcc.preliminar.repository.ClienteRepository;
import iff.tcc.preliminar.repository.EnderecoRepository;
import iff.tcc.preliminar.utils.RegistroUtil;
import iff.tcc.preliminar.utils.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final TokenUtil tokenUtil;
    private final RegistroUtil registroUtil;
    private final EnderecoRepository enderecoRepository;

    public List<Cliente> findAll() {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return clienteRepository.findAll();
    }

    public ClienteComEnderecoDTO findByCpf(String cpf) {
        var cliente = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new NaoEncontradoException("Cliente nao encontrado"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(cliente.getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return formatarRetorno(cliente, enderecoRepository.findByCliente(cliente));
    }

    public Cliente findById(UUID id) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(id)) {
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

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(id)) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return clienteRepository.save(registroUtil.formatarAtualizarCliente(clienteExistente, cliente));
    }

    public void delete(UUID id) {
        Cliente cliente = findById(id);
        clienteRepository.delete(cliente);
    }

    public List<Cliente> getClientesQuantidade(int quantidade) {
        return clienteRepository.findAll(Pageable.ofSize(quantidade)).getContent();
    }

    public ClienteComEnderecoDTO formatarRetorno(Cliente cliente, Optional<Endereco> endereco) {
        return ClienteComEnderecoDTO.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .email(cliente.getEmail())
                .cpf(cliente.getCpf())
                .telefone(cliente.getTelefone())
                .dataDeNascimento(cliente.getDataDeNascimento())
                .endereco(formatarEndereco(endereco))
                .dataDeCriacao(cliente.getDataDeCriacao())
                .dataDeAtualizacao(cliente.getDataDeAtualizacao())
                .build();
    }

    private EnderecoDTO formatarEndereco(Optional<Endereco> endereco) {
        return endereco.map(value -> EnderecoDTO.builder()
                .uf(value.getUf())
                .cidade(value.getCidade())
                .bairro(value.getBairro())
                .logradouro(value.getLogradouro())
                .numero(value.getNumero())
                .cep(value.getCep())
                .complemento(value.getComplemento())
                .dataDeCriacao(value.getDataDeCriacao())
                .dataDeAtualizacao(value.getDataDeAtualizacao())
                .build()).orElse(null);
    }
}
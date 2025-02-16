package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.Endereco;
import iff.tcc.ajustado.entity.dto.EnderecoDTO;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.exception.NaoPermitidoException;
import iff.tcc.ajustado.repository.ClienteRepository;
import iff.tcc.ajustado.repository.EnderecoRepository;
import iff.tcc.ajustado.utils.TokenUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class EnderecoService {

    @Inject
    EnderecoRepository enderecoRepository;

    @Inject
    ClienteRepository clienteRepository;

    @Inject
    TokenUtil tokenUtil;

    public List<Endereco> listar() {
        return enderecoRepository.listAll();
    }

    public Endereco buscar(UUID id) {
        return enderecoRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Endereço não encontrado"));
    }

    @Transactional
    public Endereco criar(EnderecoDTO novoEndereco) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(novoEndereco.getClienteId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        var endereco = formatarEndereco(novoEndereco);
        enderecoRepository.persist(endereco);
        return endereco;
    }

    @Transactional
    public Endereco atualizar(UUID id, EnderecoDTO novoEndereco) {
        var endereco = buscar(id);
        endereco.setLogradouro(novoEndereco.getLogradouro());
        endereco.setNumero(novoEndereco.getNumero());
        endereco.setComplemento(novoEndereco.getComplemento());
        endereco.setBairro(novoEndereco.getBairro());
        endereco.setCidade(novoEndereco.getCidade());
        endereco.setUf(novoEndereco.getUf());
        endereco.setCep(novoEndereco.getCep());
        enderecoRepository.persist(endereco);
        return endereco;
    }

    @Transactional
    public void deletar(UUID id) {
        var endereco = buscar(id);
        enderecoRepository.delete(endereco);
    }

    private Endereco formatarEndereco(EnderecoDTO novoEndereco) {
        var endereco = new Endereco();
        endereco.setLogradouro(novoEndereco.getLogradouro());
        endereco.setNumero(novoEndereco.getNumero());
        endereco.setComplemento(novoEndereco.getComplemento());
        endereco.setBairro(novoEndereco.getBairro());
        endereco.setCidade(novoEndereco.getCidade());
        endereco.setUf(novoEndereco.getUf());
        endereco.setCep(novoEndereco.getCep());
        endereco.setCliente(clienteRepository.findByIdOptional(novoEndereco.getClienteId())
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado")));
        return endereco;
    }
}

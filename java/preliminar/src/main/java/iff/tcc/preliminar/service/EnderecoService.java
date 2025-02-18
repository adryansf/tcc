package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Endereco;
import iff.tcc.preliminar.entity.dto.EnderecoDTO;
import iff.tcc.preliminar.entity.dto.JWTSubjectDTO;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.exception.NaoPermitidoException;
import iff.tcc.preliminar.repository.ClienteRepository;
import iff.tcc.preliminar.repository.EnderecoRepository;
import iff.tcc.preliminar.utils.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final TokenUtil tokenUtil;
    private final ClienteRepository clienteRepository;

    public List<Endereco> findAll() {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return enderecoRepository.findAll();
    }

    public Endereco findById(UUID id) {
        var endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Endereço não encontrado"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(endereco.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return endereco;
    }

    public Endereco save(EnderecoDTO endereco) {
        var usuario = tokenUtil.extrairUsuario();

        return enderecoRepository.save(formatarEndereco(endereco, usuario.getUsuario()));
    }

    public Endereco update(UUID id, EnderecoDTO endereco) {
        var usuario = tokenUtil.extrairUsuario();
        Endereco existingEndereco = findById(id);
        existingEndereco.setLogradouro(endereco.getLogradouro());
        existingEndereco.setNumero(endereco.getNumero());
        existingEndereco.setComplemento(endereco.getComplemento());
        existingEndereco.setBairro(endereco.getBairro());
        existingEndereco.setCidade(endereco.getCidade());
        existingEndereco.setUf(endereco.getUf());
        existingEndereco.setCep(endereco.getCep());
        existingEndereco.setCliente(clienteRepository.findById(usuario.getUsuario().getId())
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado")));
        return enderecoRepository.save(existingEndereco);
    }

    public void delete(UUID id) {
        Endereco endereco = findById(id);
        enderecoRepository.delete(endereco);
    }

    private Endereco formatarEndereco(EnderecoDTO novoEndereco, JWTSubjectDTO usuario) {
        var endereco = new Endereco();
        endereco.setLogradouro(novoEndereco.getLogradouro());
        endereco.setNumero(novoEndereco.getNumero());
        endereco.setComplemento(novoEndereco.getComplemento());
        endereco.setBairro(novoEndereco.getBairro());
        endereco.setCidade(novoEndereco.getCidade());
        endereco.setUf(novoEndereco.getUf());
        endereco.setCep(novoEndereco.getCep());
        endereco.setCliente(clienteRepository.findById(usuario.getId())
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado")));
        return endereco;
    }
}
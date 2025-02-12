package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Conta;
import iff.tcc.preliminar.entity.dto.ContaDTO;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.exception.NaoPermitidoException;
import iff.tcc.preliminar.repository.AgenciaRepository;
import iff.tcc.preliminar.repository.ClienteRepository;
import iff.tcc.preliminar.repository.ContaRepository;
import iff.tcc.preliminar.utils.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository contaRepository;
    private final AgenciaRepository agenciaRepository;
    private final ClienteRepository clienteRepository;
    private final TokenUtil tokenUtil;

    public List<Conta> findAll() {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return contaRepository.findAll();
    }

    public Conta findById(UUID id) {
        var conta = contaRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Conta não encontrada!"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(conta.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return conta;
    }

    public Conta save(ContaDTO conta) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(conta.getClienteId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return contaRepository.save(criarConta(conta));
    }

    public void delete(UUID id) {
        Conta conta = findById(id);
        contaRepository.delete(conta);
    }

    private Conta criarConta(ContaDTO novaConta) {
        var conta = new Conta();
        conta.setAgencia(agenciaRepository.findById(novaConta.getAgenciaId())
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada!")));
        conta.setCliente(clienteRepository.findById(novaConta.getClienteId())
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado!")));
        conta.setSaldo(0);
        conta.setNumero(novaConta.getNumero());
        conta.setTipo(novaConta.getTipo());
        return conta;
    }
}
package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.Conta;
import iff.tcc.ajustado.entity.dto.ContaDTO;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.exception.NaoPermitidoException;
import iff.tcc.ajustado.repository.AgenciaRepository;
import iff.tcc.ajustado.repository.ClienteRepository;
import iff.tcc.ajustado.repository.ContaRepository;
import iff.tcc.ajustado.utils.TokenUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ContaService {

    @Inject
    ContaRepository contaRepository;

    @Inject
    AgenciaRepository agenciaRepository;

    @Inject
    ClienteRepository clienteRepository;

    @Inject
    TokenUtil tokenUtil;

    public List<Conta> listar() {
        return contaRepository.listAll();
    }

    public Conta buscarPorId(UUID id) {
        var conta = contaRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Conta não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(conta.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return conta;
    }

    @Transactional
    public Conta criar(ContaDTO conta) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(conta.getClienteId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        var novaConta = criarConta(conta);
        contaRepository.persist(novaConta);
        return novaConta;
    }

    @Transactional
    public Conta atualizar(UUID id, ContaDTO conta) {
        var contaExistente = contaRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Conta não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(contaExistente.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        var contaAtualizada = criarConta(conta);
        contaAtualizada.setId(contaExistente.getId());
        contaRepository.persist(contaAtualizada);
        return contaAtualizada;
    }

    @Transactional
    public void remover(UUID id) {
        var conta = buscarPorId(id);

        if(conta.getSaldo() != 0) {
            throw new NaoPermitidoException("Conta não pode ser excluída pois possui saldo");
        }

        contaRepository.delete(conta);
    }

    private Conta criarConta(ContaDTO novaConta) {
        var conta = new Conta();
        conta.setAgencia(agenciaRepository.findByIdOptional(novaConta.getAgenciaId())
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada!")));
        conta.setCliente(clienteRepository.findByIdOptional(novaConta.getClienteId())
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado!")));
        conta.setSaldo(0);
        conta.setNumero(novaConta.getNumero());
        conta.setTipo(novaConta.getTipo());
        return conta;
    }
}

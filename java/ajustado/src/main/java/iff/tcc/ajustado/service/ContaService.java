package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Conta;
import iff.tcc.ajustado.entity.dto.ContaDTO;
import iff.tcc.ajustado.entity.dto.ContaSemSaldoDTO;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.exception.NaoPermitidoException;
import iff.tcc.ajustado.exception.RegistroInvalidoException;
import iff.tcc.ajustado.repository.AgenciaRepository;
import iff.tcc.ajustado.repository.ClienteRepository;
import iff.tcc.ajustado.repository.ContaRepository;
import iff.tcc.ajustado.repository.GerenteRepository;
import iff.tcc.ajustado.utils.TokenUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;

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
    GerenteRepository gerenteRepository;

    @Inject
    TokenUtil tokenUtil;

    public List<ContaSemSaldoDTO> listar(String cpf) {
        var cliente = clienteRepository.findByCpf(cpf);

        return contaRepository.findAllByClienteSemSaldo(cliente);
    }

    public Conta buscarPorId(UUID id) {
        var conta = contaRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Conta não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(conta.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return conta;
    }

    @Transactional
    public void criar(ContaDTO conta) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            conta.setIdCliente(usuario.getUsuario().getId());
        }

        if (usuario.isGerente()) {
            var gerente = gerenteRepository.findByIdOptional(usuario.getUsuario().getId())
                    .orElseThrow(() -> new NaoEncontradoException("Gerente não encontrado"));

            conta.setIdAgencia(gerente.getAgencia().getId());
        }

        contaRepository.persist(criarConta(conta));
    }

    @Transactional
    public Conta atualizar(UUID id, ContaDTO conta) {
        var contaExistente = contaRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Conta não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(contaExistente.getCliente().getId())) {
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

        if (conta.getSaldo() != 0) {
            throw new NaoPermitidoException("Conta não pode ser excluída pois possui saldo");
        }

        contaRepository.delete(conta);
    }

    private Conta criarConta(ContaDTO novaConta) {
        var conta = new Conta();

        if (novaConta.getIdAgencia() == null) {
            throw new RegistroInvalidoException("Agência é obrigatória");
        }

        if (novaConta.getIdCliente() == null) {
            throw new RegistroInvalidoException("Cliente é obrigatório");
        }

        conta.setAgencia(agenciaRepository.findByIdOptional(novaConta.getIdAgencia())
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada!")));
        conta.setCliente(clienteRepository.findByIdOptional(novaConta.getIdCliente())
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado!")));
        conta.setSaldo(0);
        conta.setTipo(novaConta.getTipo());
        return conta;
    }
}

package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Conta;
import iff.tcc.ajustado.entity.Transacao;
import iff.tcc.ajustado.entity.dto.TransacaoContaSemSaldoDTO;
import iff.tcc.ajustado.entity.dto.TransacaoDTO;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.exception.NaoPermitidoException;
import iff.tcc.ajustado.exception.RegistroInvalidoException;
import iff.tcc.ajustado.repository.ContaRepository;
import iff.tcc.ajustado.repository.TransacaoRepository;
import iff.tcc.ajustado.utils.TokenUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class TransacaoService {

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    ContaRepository contaRepository;

    @Inject
    TokenUtil tokenUtil;

    public List<TransacaoContaSemSaldoDTO> listar(UUID idConta) {
        var conta = contaRepository.findByIdOptional(idConta)
                .orElseThrow(() -> new NaoEncontradoException("Conta não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(conta.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return transacaoRepository.findByConta(idConta);
    }

    public Transacao buscar(UUID id) {
        return transacaoRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Transacao nao encontrada"));
    }


    @Transactional
    public void salvar(TransacaoDTO transacao) {
        if (transacao.getIdContaDestino() == transacao.getIdContaOrigem()) {
            throw new RegistroInvalidoException("A conta de destino nao pode ser a mesma conta de origem");
        }

        switch (transacao.getTipo()) {
            case SAQUE -> salvarSaque(transacao);

            case DEPOSITO -> salvarDeposito(transacao);

            case TRANSFERENCIA -> salvarTransferencia(transacao);

            case null, default -> throw new RegistroInvalidoException("Tipo de transação inválido");
        }
    }

    private void salvarDeposito(TransacaoDTO transacao) {
        if (transacao.getIdContaDestino() == null) {
            throw new RegistroInvalidoException("Conta de Destino é obrigatória");
        }

        var contaDestino = contaRepository.findByIdOptional(transacao.getIdContaDestino())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Origem não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(contaDestino.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        contaDestino.setSaldo(contaDestino.getSaldo() + transacao.getValor());
        contaRepository.persist(contaDestino);

        transacaoRepository.persist(formatarTransacao(transacao, null, contaDestino));
    }

    private void salvarSaque(TransacaoDTO transacao) {
        if (transacao.getIdContaOrigem() == null) {
            throw new RegistroInvalidoException("Conta de Origem é obrigatória");
        }

        var contaOrigem = contaRepository.findByIdOptional(transacao.getIdContaOrigem())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Origem não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(contaOrigem.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        if (contaOrigem.getSaldo() < transacao.getValor()) {
            throw new RegistroInvalidoException("Saldo insuficiente");
        }

        contaOrigem.setSaldo(contaOrigem.getSaldo() - transacao.getValor());
        contaRepository.persist(contaOrigem);

        transacaoRepository.persist(formatarTransacao(transacao, contaOrigem, null));
    }

    private void salvarTransferencia(TransacaoDTO transacao) {
        if (transacao.getIdContaOrigem() == null) {
            throw new RegistroInvalidoException("Conta de Origem é obrigatória");
        }

        if (transacao.getIdContaDestino() == null) {
            throw new RegistroInvalidoException("Conta de Destino é obrigatória");
        }

        var contaOrigem = contaRepository.findByIdOptional(transacao.getIdContaOrigem())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Origem não encontrada"));

        var contaDestino = contaRepository.findByIdOptional(transacao.getIdContaDestino())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Destino não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(contaOrigem.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        if (contaOrigem.getSaldo() < transacao.getValor()) {
            throw new RegistroInvalidoException("Saldo insuficiente");
        }

        contaOrigem.setSaldo(contaOrigem.getSaldo() - transacao.getValor());
        contaRepository.persist(contaOrigem);

        contaDestino.setSaldo(contaDestino.getSaldo() + transacao.getValor());
        contaRepository.persist(contaDestino);

        transacaoRepository.persist(formatarTransacao(transacao, contaOrigem, contaDestino));
    }

    private Transacao formatarTransacao(TransacaoDTO transacao, Conta contaOrigem, Conta contaDestino) {
        var novaTransacao = new Transacao();
        novaTransacao.setContaOrigem(contaOrigem);
        novaTransacao.setContaDestino(contaDestino);
        novaTransacao.setValor(transacao.getValor());
        novaTransacao.setTipo(transacao.getTipo());

        return novaTransacao;
    }
}

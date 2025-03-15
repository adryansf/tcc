package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Conta;
import iff.tcc.preliminar.entity.Transacao;
import iff.tcc.preliminar.entity.dto.TransacaoDTO;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.exception.NaoPermitidoException;
import iff.tcc.preliminar.exception.RegistroInvalidoException;
import iff.tcc.preliminar.repository.ContaRepository;
import iff.tcc.preliminar.repository.TransacaoRepository;
import iff.tcc.preliminar.utils.TokenUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final ContaRepository contaRepository;
    private final TokenUtil tokenUtil;

    public List<Transacao> findAll() {
        return transacaoRepository.findAll();
    }

    public List<Transacao> findAllByConta(UUID idConta) {
        var conta = contaRepository.findById(idConta)
                .orElseThrow(() -> new NaoEncontradoException("Conta não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(conta.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return transacaoRepository.findByConta(conta);
    }

    public Transacao findById(UUID id) {
        return transacaoRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Transaçao nao encontrada"));
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

        var contaDestino = contaRepository.findById(transacao.getIdContaDestino())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Origem não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(contaDestino.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        contaDestino.setSaldo(contaDestino.getSaldo() + transacao.getValor());
        contaRepository.save(contaDestino);

        transacaoRepository.save(formatarTransacao(transacao, null, contaDestino));
    }

    private void salvarSaque(TransacaoDTO transacao) {
        if (transacao.getIdContaOrigem() == null) {
            throw new RegistroInvalidoException("Conta de Origem é obrigatória");
        }

        var contaOrigem = contaRepository.findById(transacao.getIdContaOrigem())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Origem não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(contaOrigem.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        if (contaOrigem.getSaldo() < transacao.getValor()) {
            throw new RegistroInvalidoException("Saldo insuficiente");
        }

        contaOrigem.setSaldo(contaOrigem.getSaldo() - transacao.getValor());
        contaRepository.save(contaOrigem);

        transacaoRepository.save(formatarTransacao(transacao, contaOrigem, null));
    }

    private void salvarTransferencia(TransacaoDTO transacao) {
        if (transacao.getIdContaOrigem() == null) {
            throw new RegistroInvalidoException("Conta de Origem é obrigatória");
        }

        if (transacao.getIdContaDestino() == null) {
            throw new RegistroInvalidoException("Conta de Destino é obrigatória");
        }

        var contaOrigem = contaRepository.findById(transacao.getIdContaOrigem())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Origem não encontrada"));

        var contaDestino = contaRepository.findById(transacao.getIdContaDestino())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Destino não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(contaOrigem.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        if (contaOrigem.getSaldo() < transacao.getValor()) {
            throw new RegistroInvalidoException("Saldo insuficiente");
        }

        contaOrigem.setSaldo(contaOrigem.getSaldo() - transacao.getValor());
        contaRepository.save(contaOrigem);

        contaDestino.setSaldo(contaDestino.getSaldo() + transacao.getValor());
        contaRepository.save(contaDestino);

        transacaoRepository.save(formatarTransacao(transacao, contaOrigem, contaDestino));
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
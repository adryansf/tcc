package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Cliente;
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

    public Transacao findById(UUID id) {
        return transacaoRepository.findById(id).orElseThrow(() -> new NaoEncontradoException(""));
    }

    @Transactional
    public Transacao save(TransacaoDTO transacao) {

        if (transacao.getContaDestinoId() == transacao.getContaOrigemId()) {
            throw new RegistroInvalidoException("A conta de destino nao pode ser a mesma conta de origem");
        }

        var contaOrigem = contaRepository.findById(transacao.getContaOrigemId())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Origem não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(contaOrigem.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        if (contaOrigem.getSaldo() < transacao.getValor()) {
            throw new RegistroInvalidoException("Saldo insuficiente");
        }

        var contaDestino = contaRepository.findById(transacao.getContaDestinoId())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Destino não encontrada"));

        contaOrigem.setSaldo(contaOrigem.getSaldo() - transacao.getValor());
        contaDestino.setSaldo(contaDestino.getSaldo() + transacao.getValor());

        contaRepository.save(contaOrigem);
        contaRepository.save(contaDestino);
        return transacaoRepository.save(formatarTransacao(transacao, contaOrigem, contaDestino));
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
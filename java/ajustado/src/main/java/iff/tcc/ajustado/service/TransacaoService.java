package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.Conta;
import iff.tcc.ajustado.entity.Transacao;
import iff.tcc.ajustado.entity.dto.TransacaoDTO;
import iff.tcc.ajustado.entity.enums.TipoDeTransacao;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.exception.NaoPermitidoException;
import iff.tcc.ajustado.exception.RegistroInvalidoException;
import iff.tcc.ajustado.repository.ContaRepository;
import iff.tcc.ajustado.repository.TransacaoRepository;
import iff.tcc.ajustado.utils.TokenUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

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

    public List<Transacao> listar() {
        return transacaoRepository.listAll();
    }

    public Transacao buscar(UUID id) {
        return transacaoRepository.findByIdOptional(id)
                .orElseThrow(() -> new NaoEncontradoException("Transacao nao encontrada"));
    }

    @Transactional
    public Transacao salvar(TransacaoDTO transacao) {
        if (transacao.getContaDestinoId() == transacao.getContaOrigemId()) {
            throw new RegistroInvalidoException("A conta de destino nao pode ser a mesma conta de origem");
        }

        var contaOrigem = contaRepository.findByIdOptional(transacao.getContaOrigemId())
                .orElseThrow(() -> new NaoEncontradoException("Conta de Origem não encontrada"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !((Cliente) usuario.getUsuario()).getId().equals(contaOrigem.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        if (contaOrigem.getSaldo() < transacao.getValor() && transacao.getTipo() != TipoDeTransacao.DEPOSITO) {
            throw new RegistroInvalidoException("Saldo insuficiente");
        }
        contaOrigem.setSaldo(contaOrigem.getSaldo() - transacao.getValor());
        contaRepository.persist(contaOrigem);

        if(transacao.getContaDestinoId() != null) {
            var contaDestino = contaRepository.findByIdOptional(transacao.getContaDestinoId())
                    .orElseThrow(() -> new NaoEncontradoException("Conta de Destino não encontrada"));

            contaDestino.setSaldo(contaDestino.getSaldo() + transacao.getValor());
            contaRepository.persist(contaDestino);

            var novaTran = formatarTransacao(transacao, contaOrigem, contaDestino);
            transacaoRepository.persist(novaTran);
            return novaTran;
        }

        var novaTran = formatarTransacao(transacao, contaOrigem);
        transacaoRepository.persist(novaTran);
        return novaTran;

    }
    private Transacao formatarTransacao(TransacaoDTO transacao, Conta contaOrigem, Conta contaDestino) {
        var novaTransacao = new Transacao();
        novaTransacao.setContaOrigem(contaOrigem);
        novaTransacao.setContaDestino(contaDestino);
        novaTransacao.setValor(transacao.getValor());
        novaTransacao.setTipo(transacao.getTipo());

        return novaTransacao;
    }

    private Transacao formatarTransacao(TransacaoDTO transacao, Conta contaOrigem) {
        var novaTransacao = new Transacao();
        novaTransacao.setContaOrigem(contaOrigem);
        novaTransacao.setValor(transacao.getValor());
        novaTransacao.setTipo(transacao.getTipo());

        return novaTransacao;
    }
}

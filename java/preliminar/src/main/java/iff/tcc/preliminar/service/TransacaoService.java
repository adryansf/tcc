package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Transacao;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.repository.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;

    public List<Transacao> findAll() {
        return transacaoRepository.findAll();
    }

    public Transacao findById(UUID id) {
        return transacaoRepository.findById(id).orElseThrow(() -> new NaoEncontradoException(""));
    }

    public Transacao save(Transacao transacao) {
        return transacaoRepository.save(transacao);
    }

    public Transacao update(UUID id, Transacao transacao) {
        Transacao existingTransacao = findById(id);
        existingTransacao.setValor(transacao.getValor());
        existingTransacao.setData(transacao.getData());
        existingTransacao.setContaOrigem(transacao.getContaOrigem());
        existingTransacao.setContaDestino(transacao.getContaDestino());
        return transacaoRepository.save(existingTransacao);
    }

    public void delete(UUID id) {
        Transacao transacao = findById(id);
        transacaoRepository.delete(transacao);
    }
}
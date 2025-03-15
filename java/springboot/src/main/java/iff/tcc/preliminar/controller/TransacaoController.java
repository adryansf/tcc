package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Transacao;
import iff.tcc.preliminar.entity.dto.TransacaoDTO;
import iff.tcc.preliminar.service.TransacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;

    @GetMapping
    public List<Transacao> getAllTransacoes(@RequestParam(name = "idConta") UUID idConta) {
        return transacaoService.findAllByConta(idConta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transacao> getTransacaoById(@PathVariable UUID id) {
        Transacao transacao = transacaoService.findById(id);
        return ResponseEntity.ok(transacao);
    }

    @PostMapping
    public ResponseEntity<Void> createTransacao(@RequestBody TransacaoDTO transacao) {
        transacaoService.salvar(transacao);
        return new ResponseEntity<Void>(HttpStatus.CREATED);
    }
}
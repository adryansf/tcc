package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Conta;
import iff.tcc.preliminar.entity.dto.ContaDTO;
import iff.tcc.preliminar.entity.dto.ContaSemSaldoProjection;
import iff.tcc.preliminar.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/contas")
@RequiredArgsConstructor
public class ContaController {

    private final ContaService contaService;

    @GetMapping
    public List<ContaSemSaldoProjection> getAllContas(@RequestParam(name = "cpf") String cpf) {
        return contaService.findAll(cpf);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conta> getContaById(@PathVariable UUID id) {
        Conta conta = contaService.findById(id);
        return ResponseEntity.ok(conta);
    }

    @PostMapping
    public ResponseEntity<Void> createConta(@RequestBody ContaDTO conta) {
        contaService.save(conta);
        return new ResponseEntity<Void>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConta(@PathVariable UUID id) {
        contaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
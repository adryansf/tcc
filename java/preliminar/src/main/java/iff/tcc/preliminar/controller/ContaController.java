package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Conta;
import iff.tcc.preliminar.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/contas")
@RequiredArgsConstructor
public class ContaController {

    private final ContaService contaService;

    @GetMapping
    public List<Conta> getAllContas() {
        return contaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conta> getContaById(@PathVariable UUID id) {
        Conta conta = contaService.findById(id);
        return ResponseEntity.ok(conta);
    }

    @PostMapping
    public Conta createConta(@RequestBody Conta conta) {
        return contaService.save(conta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conta> updateConta(@PathVariable UUID id, @RequestBody Conta conta) {
        Conta updatedConta = contaService.update(id, conta);
        return ResponseEntity.ok(updatedConta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConta(@PathVariable UUID id) {
        contaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
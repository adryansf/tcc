package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Endereco;
import iff.tcc.preliminar.entity.dto.EnderecoDTO;
import iff.tcc.preliminar.service.EnderecoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/enderecos")
@RequiredArgsConstructor
public class EnderecoController {

    private final EnderecoService enderecoService;

    @GetMapping
    public List<Endereco> getAllEnderecos() {
        return enderecoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Endereco> getEnderecoById(@PathVariable UUID id) {
        Endereco endereco = enderecoService.findById(id);
        return ResponseEntity.ok(endereco);
    }

    @PostMapping
    public Endereco createEndereco(@RequestBody EnderecoDTO endereco) {
        return enderecoService.save(endereco);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Endereco> updateEndereco(@PathVariable UUID id, @RequestBody EnderecoDTO endereco) {
        Endereco updatedEndereco = enderecoService.update(id, endereco);
        return ResponseEntity.ok(updatedEndereco);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEndereco(@PathVariable UUID id) {
        enderecoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
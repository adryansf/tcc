package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Agencia;
import iff.tcc.preliminar.service.AgenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/agencias")
@RequiredArgsConstructor
public class AgenciaController {

    private final AgenciaService agenciaService;

    @GetMapping
    public List<Agencia> getAllAgencias() {
        return agenciaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agencia> getAgenciaById(@PathVariable UUID id) {
        Agencia agencia = agenciaService.findById(id);
        return ResponseEntity.ok(agencia);
    }

    @PostMapping
    public Agencia createAgencia(@RequestBody Agencia agencia) {
        return agenciaService.save(agencia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agencia> updateAgencia(@PathVariable UUID id, @RequestBody Agencia agencia) {
        Agencia updatedAgencia = agenciaService.update(id, agencia);
        return ResponseEntity.ok(updatedAgencia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgencia(@PathVariable UUID id) {
        agenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
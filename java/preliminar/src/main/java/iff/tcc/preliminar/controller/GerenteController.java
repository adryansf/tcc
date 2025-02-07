package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Gerente;
import iff.tcc.preliminar.service.GerenteService;
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
@RequestMapping("/gerentes")
@RequiredArgsConstructor
public class GerenteController {

    private final GerenteService gerenteService;

    @GetMapping
    public List<Gerente> getAllGerentes() {
        return gerenteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gerente> getGerenteById(@PathVariable UUID id) {
        Gerente gerente = gerenteService.findById(id);
        return ResponseEntity.ok(gerente);
    }

    @PostMapping
    public Gerente createGerente(@RequestBody Gerente gerente) {
        return gerenteService.save(gerente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gerente> updateGerente(@PathVariable UUID id, @RequestBody Gerente gerente) {
        Gerente updatedGerente = gerenteService.update(id, gerente);
        return ResponseEntity.ok(updatedGerente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGerente(@PathVariable UUID id) {
        gerenteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Gerente;
import iff.tcc.preliminar.entity.dto.GerenteDTO;
import iff.tcc.preliminar.service.GerenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Void> createGerente(@RequestBody GerenteDTO gerente) {
        gerenteService.save(gerente);
        return new ResponseEntity<Void>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gerente> updateGerente(@PathVariable UUID id, @RequestBody GerenteDTO gerente) {
        Gerente updatedGerente = gerenteService.update(id, gerente);
        return ResponseEntity.ok(updatedGerente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGerente(@PathVariable UUID id) {
        gerenteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.dto.ClienteComEnderecoDTO;
import iff.tcc.preliminar.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping("/cpf/{cpf}")
    public ClienteComEnderecoDTO getClienteByCpf(@PathVariable String cpf) {
        return clienteService.findByCpf(cpf);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable UUID id) {
        Cliente cliente = clienteService.findById(id);
        return ResponseEntity.ok(cliente);
    }

    @PostMapping
    public ResponseEntity<Void> createCliente(@RequestBody Cliente cliente) {
        clienteService.save(cliente);
        return new ResponseEntity<Void>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> updateCliente(@PathVariable UUID id, @RequestBody Cliente cliente) {
        Cliente updatedCliente = clienteService.update(id, cliente);
        return ResponseEntity.ok(updatedCliente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable UUID id) {
        clienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
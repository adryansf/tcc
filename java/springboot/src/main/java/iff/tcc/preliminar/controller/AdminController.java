package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Gerente;
import iff.tcc.preliminar.service.ClienteService;
import iff.tcc.preliminar.service.GerenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ClienteService clienteService;
    private final GerenteService gerenteService;

    @GetMapping("clientes")
    public List<Cliente> getClientes(@RequestParam int quantidade) {
        return clienteService.getClientesQuantidade(quantidade);
    }

    @GetMapping("gerentes")
    public List<Gerente> getGerentes(@RequestParam int quantidade) {
        return gerenteService.getGerenteQuantidade(quantidade);
    }

}

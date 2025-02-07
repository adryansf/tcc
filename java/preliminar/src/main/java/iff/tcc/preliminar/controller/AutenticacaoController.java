package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.dto.LoginDTO;
import iff.tcc.preliminar.jwt.JwtGeneratorInterface;
import iff.tcc.preliminar.service.ClienteService;
import iff.tcc.preliminar.service.GerenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/login")
@RequiredArgsConstructor
public class AutenticacaoController {

    private final JwtGeneratorInterface jwtGeneratorInterface;
    private final ClienteService clienteService;
    private final GerenteService gerenteService;

    @PostMapping("/gerente")
    public ResponseEntity<?> autenticarGerente(@RequestBody LoginDTO loginDTO) {
        var gerente = gerenteService.autorizarGerente(loginDTO);
        return ResponseEntity.ok(jwtGeneratorInterface.gerarTokenCliente(new Cliente()));
    }

    @PostMapping("/cliente")
    public ResponseEntity<?> autenticarCliente(@RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(jwtGeneratorInterface.gerarTokenCliente(new Cliente()));
    }
}

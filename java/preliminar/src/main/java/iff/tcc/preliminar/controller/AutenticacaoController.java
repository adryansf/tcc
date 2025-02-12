package iff.tcc.preliminar.controller;

import iff.tcc.preliminar.entity.dto.AuthTokenDTO;
import iff.tcc.preliminar.entity.dto.LoginDTO;
import iff.tcc.preliminar.service.AutenticacaoService;
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

    private final AutenticacaoService autenticacaoService;

    @PostMapping("/gerentes")
    public ResponseEntity<AuthTokenDTO> autenticarGerente(@RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(autenticacaoService.autorizarGerente(loginDTO));
    }

    @PostMapping("/clientes")
    public ResponseEntity<AuthTokenDTO> autenticarCliente(@RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(autenticacaoService.autorizarCliente(loginDTO));
    }
}

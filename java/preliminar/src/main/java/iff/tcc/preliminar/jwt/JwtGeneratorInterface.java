package iff.tcc.preliminar.jwt;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Gerente;
import iff.tcc.preliminar.entity.dto.AuthTokenDTO;

public interface JwtGeneratorInterface {
    AuthTokenDTO gerarTokenCliente(Cliente cliente);

    AuthTokenDTO gerarTokenGerente(Gerente gerente);
}

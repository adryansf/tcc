package iff.tcc.preliminar.jwt;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Gerente;

import java.util.Map;

public interface JwtGeneratorInterface {
    Map<String, String> gerarTokenCliente(Cliente cliente);

    Map<String, String> gerarTokenGerente(Gerente gerente);
}

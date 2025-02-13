package iff.tcc.ajustado.jwt;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.Gerente;
import iff.tcc.ajustado.entity.dto.AuthTokenDTO;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Set;

@ApplicationScoped
public class JwtGenerator {
    private static final String EMISSOR = "e6AXaA6D58$2SV.+";

    public AuthTokenDTO gerarTokenCliente(Cliente cliente) {
        String token = Jwt.issuer(EMISSOR)
                .subject(cliente.getCpf())
                .groups(Set.of("cliente"))
                .sign();
        return AuthTokenDTO.builder().token(token).message("Cliente autenticado").build();
    }

    public AuthTokenDTO gerarTokenGerente(Gerente gerente) {
        String token = Jwt.issuer(EMISSOR)
                .subject(gerente.getCpf())
                .groups(Set.of("gerente"))
                .sign();
        return AuthTokenDTO.builder().token(token).message("Gerentex autenticado").build();
    }

    public String hashSenha(String senha) {
        return BCrypt.hashpw(senha, BCrypt.gensalt());
    }

    public boolean verificarSenha(String senha, String hash) {
        return BCrypt.checkpw(senha, hash);
    }
}

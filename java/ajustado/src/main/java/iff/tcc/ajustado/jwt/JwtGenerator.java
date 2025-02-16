package iff.tcc.ajustado.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public AuthTokenDTO gerarTokenCliente(Cliente cliente) {
        try{
            String token = Jwt.issuer(EMISSOR)
                    .subject(objectMapper.writeValueAsString(cliente))
                    .groups(Set.of("cliente"))
                    .sign();

            return AuthTokenDTO.builder().token(token).message("Cliente autenticado").build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public AuthTokenDTO gerarTokenGerente(Gerente gerente) {
        try{
            String token = Jwt.issuer(EMISSOR)
                    .subject(objectMapper.writeValueAsString(gerente))
                    .groups(Set.of("gerente"))
                    .sign();

            return AuthTokenDTO.builder().token(token).message("Gerente autenticado").build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String hashSenha(String senha) {
        return BCrypt.hashpw(senha, BCrypt.gensalt());
    }

    public boolean verificarSenha(String senha, String hash) {
        return BCrypt.checkpw(senha, hash);
    }
}

package iff.tcc.ajustado.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.Gerente;
import iff.tcc.ajustado.entity.dto.AuthTokenDTO;
import iff.tcc.ajustado.entity.dto.JWTSubjectDTO;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Set;

@ApplicationScoped
public class JwtGenerator {
    private static final String EMISSOR = "e6AXaA6D58$2SV.+";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public AuthTokenDTO gerarTokenCliente(Cliente cliente) {
        var jwtSubject = JWTSubjectDTO.builder()
                .email(cliente.getEmail())
                .id(cliente.getId())
                .cpf(cliente.getCpf())
                .build();

        try {
            String token = Jwt.issuer(EMISSOR)
                    .subject(objectMapper.writeValueAsString(jwtSubject))
                    .groups(Set.of("cliente"))
                    .expiresIn(86400)
                    .sign();

            return AuthTokenDTO.builder()
                    .token(token)
                    .expiraEm(86400)
                    .usuario(cliente)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public AuthTokenDTO gerarTokenGerente(Gerente gerente) {
        var jwtSubject = JWTSubjectDTO.builder()
                .email(gerente.getEmail())
                .id(gerente.getId())
                .cpf(gerente.getCpf())
                .build();

        try {
            String token = Jwt.issuer(EMISSOR)
                    .subject(objectMapper.writeValueAsString(jwtSubject))
                    .groups(Set.of("gerente"))
                    .expiresIn(86400)
                    .sign();

            return AuthTokenDTO.builder()
                    .token(token)
                    .expiraEm(86400)
                    .usuario(gerente)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

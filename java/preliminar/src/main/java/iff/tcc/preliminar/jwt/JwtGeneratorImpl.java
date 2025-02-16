package iff.tcc.preliminar.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Gerente;
import iff.tcc.preliminar.entity.dto.AuthTokenDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtGeneratorImpl implements JwtGeneratorInterface {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final String EMISSOR = "e6AXaA6D58$2SV.+";
    private static final String TOKEN_KEY_SECRET = "x![dl43;@![g@ltK[IV(]bp)r,=a^42%";

    @Override
    public AuthTokenDTO gerarTokenCliente(Cliente cliente) {
        Key secretKey = Keys.hmacShaKeyFor(TOKEN_KEY_SECRET.getBytes());
        String jwtToken = "";
        try {
            jwtToken = Jwts.builder()
                    .setSubject(objectMapper.writeValueAsString(cliente))
                    .setIssuer(EMISSOR)
                    .setIssuedAt(new Date())
                    .signWith(secretKey, SignatureAlgorithm.HS256)
                    .claim("cargo", "cliente")
                    .compact();
            return AuthTokenDTO.builder().token(jwtToken).message("Cliente autenticado").build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar token de cliente", e);
        }
    }

    public AuthTokenDTO gerarTokenGerente(Gerente gerente) {
        Key secretKey = Keys.hmacShaKeyFor(TOKEN_KEY_SECRET.getBytes());
        String jwtToken = "";
        try {
            jwtToken = Jwts.builder()
                    .setSubject(objectMapper.writeValueAsString(gerente))
                    .setIssuer(EMISSOR)
                    .setIssuedAt(new Date())
                    .signWith(secretKey, SignatureAlgorithm.HS256)
                    .claim("cargo", "gerente")
                    .compact();
            return AuthTokenDTO.builder().token(jwtToken).message("Gerente autenticado").build();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar token de gerente", e);
        }
    }

    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
}

package iff.tcc.preliminar.jwt;

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

    private static final String EMISSOR = "e6AXaA6D58$2SV.+";
    private static final String TOKEN_KEY_SECRET = "x![dl43;@![g@ltK[IV(]bp)r,=a^42%";

    @Override
    public AuthTokenDTO gerarTokenCliente(Cliente cliente) {
        Key secretKey = Keys.hmacShaKeyFor(TOKEN_KEY_SECRET.getBytes());
        String jwtToken = "";
        jwtToken = Jwts.builder()
                .setSubject(cliente.getCpf())
                .setIssuer(EMISSOR)
                .setIssuedAt(new Date())
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .claim("cargo", "cliente")
                .compact();
        return AuthTokenDTO.builder().token(jwtToken).message("Cliente autenticado").build();
    }

    public AuthTokenDTO gerarTokenGerente(Gerente gerente) {
        Key secretKey = Keys.hmacShaKeyFor(TOKEN_KEY_SECRET.getBytes());
        String jwtToken = "";
        jwtToken = Jwts.builder()
                .setSubject(gerente.getCpf())
                .setIssuer(EMISSOR)
                .setIssuedAt(new Date())
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .claim("cargo", "gerente")
                .compact();
        return AuthTokenDTO.builder().token(jwtToken).message("Gerente autenticado").build();
    }

    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
}

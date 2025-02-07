package iff.tcc.preliminar.jwt;

import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Gerente;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtGeneratorImpl implements JwtGeneratorInterface {

    private static final String EMISSOR = "e6AXaA6D58$2SV.+";
    private static final String TOKEN_KEY_SECRET = "x![dl43;@![g@ltK[IV(]bp)r,=a^42%";

    @Override
    public Map<String, String> gerarTokenCliente(Cliente cliente) {
        Key secretKey = Keys.hmacShaKeyFor(TOKEN_KEY_SECRET.getBytes());
        String jwtToken = "";
        jwtToken = Jwts.builder()
                .setSubject(cliente.getCpf())
                .setIssuer(EMISSOR)
                .setIssuedAt(new Date())
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .claim("cargo", "cliente")
                .compact();
        Map<String, String> jwtTokenGen = new HashMap<>();
        jwtTokenGen.put("token", jwtToken);
        jwtTokenGen.put("message", "Cliente autenticado");
        return jwtTokenGen;
    }

    public Map<String, String> gerarTokenGerente(Gerente gerente) {
        Key secretKey = Keys.hmacShaKeyFor(TOKEN_KEY_SECRET.getBytes());
        String jwtToken = "";
        jwtToken = Jwts.builder()
                .setSubject(gerente.getCpf())
                .setIssuer(EMISSOR)
                .setIssuedAt(new Date())
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .claim("cargo", "gerente")
                .compact();
        Map<String, String> jwtTokenGen = new HashMap<>();
        jwtTokenGen.put("token", jwtToken);
        jwtTokenGen.put("message", "Gerente autenticado");
        return jwtTokenGen;
    }

    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
}

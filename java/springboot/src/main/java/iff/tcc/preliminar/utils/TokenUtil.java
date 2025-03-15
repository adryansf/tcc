package iff.tcc.preliminar.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import iff.tcc.preliminar.entity.dto.JWTSubjectDTO;
import iff.tcc.preliminar.entity.dto.UsuarioDTO;
import iff.tcc.preliminar.exception.NaoAutorizadoException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class TokenUtil {

    private static final String EMISSOR = "e6AXaA6D58$2SV.+";
    private static final String TOKEN_KEY_SECRET = "x![dl43;@![g@ltK[IV(]bp)r,=a^42%";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Authentication decodeToken(HttpServletRequest request) {

        String jwtToken = request.getHeader("Authorization");
        jwtToken = jwtToken.replace("Bearer ", "");

        //fazer a leitura d otoken
        Jws<Claims> jwsClaims = getClaimsJws(jwtToken);

        String usuario = jwsClaims.getBody().getSubject();
        String emissor = jwsClaims.getBody().getIssuer();
        String cargo = jwsClaims.getBody().get("cargo", String.class);

        if (StringUtils.isNotEmpty(usuario) & emissor.equals(EMISSOR)) {
            return new UsernamePasswordAuthenticationToken(cargo, null, Collections.emptyList());
        }
        throw new NaoAutorizadoException("Usuário não autorizado");
    }

    private static Jws<Claims> getClaimsJws(String jwtToken) {
        Jws<Claims> jwsClaims = Jwts.parserBuilder()
                .setSigningKey(TOKEN_KEY_SECRET.getBytes())
                .build().parseClaimsJws(jwtToken);
        return jwsClaims;
    }

    public UsuarioDTO extrairUsuario() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String jwtToken = requestAttributes.getRequest().getHeader("Authorization");
        jwtToken = jwtToken.replace("Bearer ", "");
        Jws<Claims> jwsClaims = getClaimsJws(jwtToken);
        String usuario = jwsClaims.getBody().getSubject();
        String cargo = jwsClaims.getBody().get("cargo", String.class);

        if (!"cliente".equals(cargo) && !"gerente".equals(cargo)) {
            throw new NaoAutorizadoException("Cargo inválido");
        }

        try {
            return UsuarioDTO.builder()
                    .cliente("cliente".equals(cargo))
                    .gerente("gerente".equals(cargo))
                    .usuario(objectMapper.readValue(usuario, JWTSubjectDTO.class))
                    .build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

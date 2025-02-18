package iff.tcc.ajustado.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import iff.tcc.ajustado.entity.dto.JWTSubjectDTO;
import iff.tcc.ajustado.entity.dto.UsuarioDTO;
import iff.tcc.ajustado.exception.NaoAutorizadoException;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.jwt.JsonWebToken;

@RequestScoped
public class TokenUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final String EMISSOR = "e6AXaA6D58$2SV.+";

    @Inject
    JsonWebToken jwt;

    public String getCargo() {
        return jwt.getGroups().stream().findFirst().orElse(null);
    }

    public void validarToken() {
        if (StringUtils.isEmpty(jwt.getRawToken()) || !EMISSOR.equals(jwt.getIssuer())) {
            throw new NaoAutorizadoException("Usuário não autorizado");
        }
    }

    public UsuarioDTO extrairUsuario() {
        validarToken();
        String cargo = getCargo();

        if (!"cliente".equals(cargo) && !"gerente".equals(cargo)) {
            throw new NaoAutorizadoException("Cargo inválido");
        }

        try {
            return UsuarioDTO.builder()
                    .cliente("cliente".equals(cargo))
                    .gerente("gerente".equals(cargo))
                    .usuario(objectMapper.readValue(jwt.getSubject(), JWTSubjectDTO.class))
                    .build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
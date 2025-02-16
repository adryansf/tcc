package iff.tcc.ajustado.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.Gerente;
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

        try {
            if ("cliente".equals(cargo)) {
                return UsuarioDTO.builder()
                        .cliente(true)
                        .gerente(false)
                        .usuario(objectMapper.readValue(jwt.getSubject(), Cliente.class))
                        .build();
            } else if ("gerente".equals(cargo)) {
                return UsuarioDTO.builder()
                        .cliente(false)
                        .gerente(true)
                        .usuario(objectMapper.readValue(jwt.getSubject(), Gerente.class))
                        .build();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        throw new NaoAutorizadoException("Cargo inválido");
    }
}
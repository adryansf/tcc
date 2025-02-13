package iff.tcc.ajustado.utils;

import iff.tcc.ajustado.entity.dto.UsuarioDTO;
import iff.tcc.ajustado.exception.NaoAutorizadoException;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import iff.tcc.ajustado.repository.ClienteRepository;
import iff.tcc.ajustado.repository.GerenteRepository;
import io.smallrye.jwt.auth.principal.JWTParser;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.jwt.JsonWebToken;

@RequestScoped
public class TokenUtil {

    private static final String EMISSOR = "e6AXaA6D58$2SV.+";

    @Inject
    JsonWebToken jwt;

    @Inject
    ClienteRepository clienteRepository;

    @Inject
    GerenteRepository gerenteRepository;

    @Inject
    JWTParser jwtParser;

    public String getCargo() {
        return jwt.getClaim("cargo");
    }

    public String getCpf() {
        return jwt.getSubject();
    }

    public void validarToken() {
        if (StringUtils.isEmpty(jwt.getRawToken()) || !EMISSOR.equals(jwt.getIssuer())) {
            throw new NaoAutorizadoException("Usuário não autorizado");
        }
    }

    public UsuarioDTO extrairUsuario() {
        validarToken();
        String cpf = getCpf();
        String cargo = getCargo();

        if ("cliente".equals(cargo)) {
            return UsuarioDTO.builder()
                    .cliente(true)
                    .gerente(false)
                    .usuario(clienteRepository.findByCpf(cpf))
                    .build();
        } else if ("gerente".equals(cargo)) {
            return UsuarioDTO.builder()
                    .cliente(false)
                    .gerente(true)
                    .usuario(gerenteRepository.findByCpf(cpf))
                    .build();
        }
        throw new NaoAutorizadoException("Cargo inválido");
    }
}
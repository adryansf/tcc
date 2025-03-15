package iff.tcc.ajustado.service;

import iff.tcc.ajustado.entity.dto.AuthTokenDTO;
import iff.tcc.ajustado.entity.dto.LoginDTO;
import iff.tcc.ajustado.exception.EmailOuSenhaInvalidoException;
import iff.tcc.ajustado.jwt.JwtGenerator;
import iff.tcc.ajustado.repository.ClienteRepository;
import iff.tcc.ajustado.repository.GerenteRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class AutenticacaoService {
    @Inject
    JwtGenerator jwtGeneratorInterface;
    @Inject
    GerenteRepository gerenteRepository;
    @Inject
    ClienteRepository clienteRepository;


    public AuthTokenDTO autorizarGerente(LoginDTO loginDTO) {
        if (StringUtils.isAnyEmpty(loginDTO.getEmail(), loginDTO.getSenha())) {
            throw new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!");
        }

        var gerente = gerenteRepository.findByEmail(loginDTO.getEmail());

        if (gerente.getSenha() != null && BCrypt.checkpw(loginDTO.getSenha(), gerente.getSenha())) {
            return jwtGeneratorInterface.gerarTokenGerente(gerente);
        }

        throw new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!");
    }

    public AuthTokenDTO autorizarCliente(LoginDTO loginDTO) {
        if (StringUtils.isAnyEmpty(loginDTO.getEmail(), loginDTO.getSenha())) {
            throw new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!");
        }

        var cliente = clienteRepository.findByEmail(loginDTO.getEmail());

        if (cliente.getSenha() != null && BCrypt.checkpw(loginDTO.getSenha(), cliente.getSenha())) {
            return jwtGeneratorInterface.gerarTokenCliente(cliente);
        }

        throw new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!");
    }

}

package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.dto.AuthTokenDTO;
import iff.tcc.preliminar.entity.dto.LoginDTO;
import iff.tcc.preliminar.exception.EmailOuSenhaInvalidoException;
import iff.tcc.preliminar.jwt.JwtGeneratorInterface;
import iff.tcc.preliminar.repository.ClienteRepository;
import iff.tcc.preliminar.repository.GerenteRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AutenticacaoService {

    private final JwtGeneratorInterface jwtGeneratorInterface;
    private final GerenteRepository gerenteRepository;
    private final ClienteRepository clienteRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();


    public AuthTokenDTO autorizarGerente(LoginDTO loginDTO) {
        if (StringUtils.isAnyEmpty(loginDTO.getEmail(), loginDTO.getSenha())) {
            throw new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!");
        }

        var gerente = gerenteRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!"));

        if (gerente.getSenha() != null && encoder.matches(loginDTO.getSenha(), gerente.getSenha())) {
            return jwtGeneratorInterface.gerarTokenGerente(gerente);
        }

        throw new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!");
    }

    public AuthTokenDTO autorizarCliente(LoginDTO loginDTO) {
        if (StringUtils.isAnyEmpty(loginDTO.getEmail(), loginDTO.getSenha())) {
            throw new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!");
        }

        var cliente = clienteRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!"));

        if (cliente.getSenha() != null && encoder.matches(loginDTO.getSenha(), cliente.getSenha())) {
            return jwtGeneratorInterface.gerarTokenCliente(cliente);
        }

        throw new EmailOuSenhaInvalidoException("E-mail ou senha inválidos!");
    }


}

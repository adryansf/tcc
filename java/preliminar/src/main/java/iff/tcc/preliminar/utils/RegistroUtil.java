package iff.tcc.preliminar.utils;

import br.com.caelum.stella.validation.CPFValidator;
import br.com.caelum.stella.validation.InvalidStateException;
import iff.tcc.preliminar.entity.Agencia;
import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.Gerente;
import iff.tcc.preliminar.entity.dto.GerenteDTO;
import iff.tcc.preliminar.exception.RegistroInvalidoException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class RegistroUtil {

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    private static final Pattern pattern = Pattern.compile(EMAIL_REGEX);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Cliente formatarNovoCliente(Cliente cliente) {
        var clienteFormatado = new Cliente();
        clienteFormatado.setNome(validarNome(cliente.getNome()));
        clienteFormatado.setCpf(validarCpf(cliente.getCpf()));
        clienteFormatado.setSenha(validarSenha(cliente.getSenha()));
        clienteFormatado.setEmail(validarEmail(cliente.getEmail()));
        clienteFormatado.setTelefone(validarTelefone(cliente.getTelefone()));
        clienteFormatado.setDataDeNascimento(validarDataNascimento(cliente.getDataDeNascimento()));


        return clienteFormatado;
    }

    public Cliente formatarAtualizarCliente(Cliente antigoRegistro, Cliente novoRegistro) {
        var clienteFormatado = new Cliente();
        clienteFormatado.setId(antigoRegistro.getId());
        clienteFormatado.setNome(StringUtils.isEmpty(novoRegistro.getNome()) ? antigoRegistro.getNome() : validarNome(novoRegistro.getNome()));
        clienteFormatado.setCpf(StringUtils.isEmpty(novoRegistro.getCpf()) ? antigoRegistro.getCpf() : validarCpf(novoRegistro.getCpf()));
        clienteFormatado.setSenha(StringUtils.isEmpty(novoRegistro.getSenha()) ? antigoRegistro.getSenha() : validarSenha(novoRegistro.getSenha()));
        clienteFormatado.setEmail(StringUtils.isEmpty(novoRegistro.getEmail()) ? antigoRegistro.getEmail() : validarEmail(novoRegistro.getEmail()));
        clienteFormatado.setTelefone(StringUtils.isEmpty(novoRegistro.getTelefone()) ? antigoRegistro.getTelefone() : validarTelefone(novoRegistro.getTelefone()));
        clienteFormatado.setDataDeNascimento(novoRegistro.getDataDeNascimento() == null ? antigoRegistro.getDataDeNascimento() : validarDataNascimento(novoRegistro.getDataDeNascimento()));
        return clienteFormatado;
    }

    public Gerente formatarNovoGerente(GerenteDTO gerente, Agencia agencia) {
        var gerenteFormatado = new Gerente();
        gerenteFormatado.setNome(validarNome(gerente.getNome()));
        gerenteFormatado.setCpf(validarCpf(gerente.getCpf()));
        gerenteFormatado.setSenha(validarSenha(gerente.getSenha()));
        gerenteFormatado.setEmail(validarEmail(gerente.getEmail()));
        gerenteFormatado.setTelefone(validarTelefone(gerente.getTelefone()));
        gerenteFormatado.setDataDeNascimento(validarDataNascimento(gerente.getDataDeNascimento()));
        gerenteFormatado.setAgencia(agencia);
        return gerenteFormatado;
    }

    public Gerente formatarAtualizarGerente(Gerente antigoRegistro, GerenteDTO novoRegistro, Agencia agencia) {
        var gerenteFormatado = new Gerente();
        gerenteFormatado.setId(antigoRegistro.getId());
        gerenteFormatado.setNome(StringUtils.isEmpty(novoRegistro.getNome()) ? antigoRegistro.getNome() : validarNome(novoRegistro.getNome()));
        gerenteFormatado.setCpf(StringUtils.isEmpty(novoRegistro.getCpf()) ? antigoRegistro.getCpf() : validarCpf(novoRegistro.getCpf()));
        gerenteFormatado.setSenha(StringUtils.isEmpty(novoRegistro.getSenha()) ? antigoRegistro.getSenha() : validarSenha(novoRegistro.getSenha()));
        gerenteFormatado.setEmail(StringUtils.isEmpty(novoRegistro.getEmail()) ? antigoRegistro.getEmail() : validarEmail(novoRegistro.getEmail()));
        gerenteFormatado.setTelefone(StringUtils.isEmpty(novoRegistro.getTelefone()) ? antigoRegistro.getTelefone() : validarTelefone(novoRegistro.getTelefone()));
        gerenteFormatado.setDataDeNascimento(novoRegistro.getDataDeNascimento() == null ? antigoRegistro.getDataDeNascimento() : validarDataNascimento(novoRegistro.getDataDeNascimento()));
        gerenteFormatado.setAgencia(agencia == null ? antigoRegistro.getAgencia() : agencia);
        return gerenteFormatado;
    }

    private String validarNome(String nome) {
        if (StringUtils.isEmpty(nome)) {
            throw new RegistroInvalidoException("O Nome do cliente não pode ser vazio.");
        }

        if (nome.length() < 3) {
            throw new RegistroInvalidoException("O nome do cliente precisa ter no mínimo 3 caracteres");
        }

        return StringUtils.stripAccents(nome).toUpperCase();
    }

    private String validarCpf(String cpf) {
        if (StringUtils.isEmpty(cpf)) {
            throw new RegistroInvalidoException("O CPF do cliente não pode ser vazio.");
        }

        CPFValidator cpfValidator = new CPFValidator();

        try {
            cpfValidator.assertValid(cpf);
        } catch (InvalidStateException e) {
            throw new RegistroInvalidoException("O CPF do cliente precisa ser válido");
        }

        return cpf.replace(".", "").replace("-", "");
    }

    private String validarSenha(String senha) {
        if (StringUtils.isEmpty(senha)) {
            throw new RegistroInvalidoException("A senha do cliente não pode ser vazia.");
        }

        if (senha.length() < 8) {
            throw new RegistroInvalidoException("A senha do cliente precisa ter no mínimo 6 caracteres");
        }

        return encoder.encode(senha);
    }

    private String validarEmail(String email) {
        if (StringUtils.isEmpty(email)) {
            throw new RegistroInvalidoException("O email do cliente não pode ser vazio.");
        }

        if (!pattern.matcher(email).matches()) {
            throw new RegistroInvalidoException("O email do cliente precisa ser válido");
        }

        return email;
    }

    private String validarTelefone(String telefone) {
        if (StringUtils.isEmpty(telefone)) {
            throw new RegistroInvalidoException("O telefone do cliente não pode ser vazio.");
        }

        telefone = telefone.replace("(", "").replace(")", "").replace("-", "").replace(" ", "");

        if (telefone.length() < 11) {
            throw new RegistroInvalidoException("O telefone do cliente precisa ter no mínimo 11 caracteres");
        }

        return telefone;
    }

    private Date validarDataNascimento(Date dataNascimento) {
        if (dataNascimento == null) {
            throw new RegistroInvalidoException("A data de nascimento do cliente não pode ser vazia.");
        }

        return dataNascimento;
    }
}

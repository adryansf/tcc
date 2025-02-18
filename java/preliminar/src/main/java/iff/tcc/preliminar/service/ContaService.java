package iff.tcc.preliminar.service;

import iff.tcc.preliminar.entity.Conta;
import iff.tcc.preliminar.entity.dto.ContaDTO;
import iff.tcc.preliminar.entity.dto.ContaSemSaldoProjection;
import iff.tcc.preliminar.exception.NaoEncontradoException;
import iff.tcc.preliminar.exception.NaoPermitidoException;
import iff.tcc.preliminar.exception.RegistroInvalidoException;
import iff.tcc.preliminar.repository.AgenciaRepository;
import iff.tcc.preliminar.repository.ClienteRepository;
import iff.tcc.preliminar.repository.ContaRepository;
import iff.tcc.preliminar.repository.GerenteRepository;
import iff.tcc.preliminar.utils.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository contaRepository;
    private final AgenciaRepository agenciaRepository;
    private final ClienteRepository clienteRepository;
    private final TokenUtil tokenUtil;
    private final GerenteRepository gerenteRepository;

    public List<ContaSemSaldoProjection> findAll(String cpf) {
        var cliente = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado!"));

        return contaRepository.findAllByCliente(cliente);
    }

    public Conta findById(UUID id) {
        var conta = contaRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Conta não encontrada!"));

        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente() && !usuario.getUsuario().getId().equals(conta.getCliente().getId())) {
            throw new NaoPermitidoException("Usuário não tem permissão para realizar essa ação");
        }

        return conta;
    }

    public Conta save(ContaDTO conta) {
        var usuario = tokenUtil.extrairUsuario();

        if (usuario.isCliente()) {
            conta.setIdCliente(usuario.getUsuario().getId());
        }

        if (usuario.isGerente()) {
            var gerente = gerenteRepository.findById(usuario.getUsuario().getId())
                    .orElseThrow(() -> new NaoEncontradoException("Gerente não encontrado"));

            conta.setIdAgencia(gerente.getAgencia().getId());
        }

        return contaRepository.save(criarConta(conta));
    }

    public void delete(UUID id) {
        Conta conta = findById(id);

        if (conta.getSaldo() != 0) {
            throw new RegistroInvalidoException("A conta precisa ter saldo zerado para deletar!");
        }

        contaRepository.delete(conta);
    }

    private Conta criarConta(ContaDTO novaConta) {
        var conta = new Conta();
        conta.setAgencia(agenciaRepository.findById(novaConta.getIdAgencia())
                .orElseThrow(() -> new NaoEncontradoException("Agência não encontrada!")));
        conta.setCliente(clienteRepository.findById(novaConta.getIdCliente())
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado!")));
        conta.setNumero(null);
        conta.setSaldo(0);
        conta.setTipo(novaConta.getTipo());
        return conta;
    }
}
package iff.tcc.ajustado.repository;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.Conta;
import iff.tcc.ajustado.entity.dto.ContaSemSaldoDTO;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ContaRepository implements PanacheRepositoryBase<Conta, UUID> {

    public List<Conta> findAllByCliente(Cliente cliente) {
        return find("cliente", cliente).list();
    }

    public List<ContaSemSaldoDTO> findAllByClienteSemSaldo(Cliente cliente) {
        return find("cliente", cliente).project(ContaSemSaldoDTO.class).list();
    }
}

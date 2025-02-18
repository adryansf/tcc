package iff.tcc.preliminar.entity.dto;

import iff.tcc.preliminar.entity.Agencia;
import iff.tcc.preliminar.entity.Cliente;
import iff.tcc.preliminar.entity.enums.TipoDeConta;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ContaSemSaldoProjection {
    UUID getId();

    Integer getNumero();

    TipoDeConta getTipo();

    Agencia getAgencia();

    Cliente getCliente();

    LocalDateTime getDataDeAtualizacao();

    LocalDateTime getDataDeCriacao();
}

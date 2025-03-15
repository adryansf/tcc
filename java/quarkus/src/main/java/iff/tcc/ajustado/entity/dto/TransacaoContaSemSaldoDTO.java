package iff.tcc.ajustado.entity.dto;

import iff.tcc.ajustado.entity.enums.TipoDeTransacao;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransacaoContaSemSaldoDTO {
    private UUID id;
    private LocalDateTime dataDeCriacao;
    private ContaSemSaldoDTO contaOrigem;
    private ContaSemSaldoDTO contaDestino;
    private TipoDeTransacao tipo;
}

package iff.tcc.preliminar.entity.dto;

import iff.tcc.preliminar.entity.enums.TipoDeTransacao;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TransacaoDTO {
    private long valor;
    private UUID idContaOrigem;
    private UUID idContaDestino;
    private TipoDeTransacao tipo;
}

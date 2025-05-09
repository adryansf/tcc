package iff.tcc.ajustado.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@Data
public class EntidadeBase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "\"dataDeCriacao\"", insertable = false)
    private LocalDateTime dataDeCriacao;
    @Column(name = "\"dataDeAtualizacao\"", insertable = false)
    private LocalDateTime dataDeAtualizacao;
}

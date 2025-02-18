package iff.tcc.ajustado.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(insertable = false)
    private LocalDateTime dataDeCriacao;
    @Column(insertable = false)
    private LocalDateTime dataDeAtualizacao;
}

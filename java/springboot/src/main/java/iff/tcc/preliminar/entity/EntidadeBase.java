package iff.tcc.preliminar.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@Data
public class EntidadeBase {
    @Id
    @UuidGenerator
    private UUID id;
    @Column(insertable = false)
    private LocalDateTime dataDeCriacao;
    @Column(insertable = false)
    private LocalDateTime dataDeAtualizacao;
}

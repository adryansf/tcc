package iff.tcc.preliminar.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private LocalDateTime dataDeCriacao;
    @JsonIgnore
    private LocalDateTime dataDeAtualizacao;
}

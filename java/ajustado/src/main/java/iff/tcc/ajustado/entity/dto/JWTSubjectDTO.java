package iff.tcc.ajustado.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class JWTSubjectDTO {
    private UUID id;
    private String email;
    private String cpf;
}

package iff.tcc.preliminar.entity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthTokenDTO {
    private long expiraEm;
    private String token;
    private Object usuario;
}

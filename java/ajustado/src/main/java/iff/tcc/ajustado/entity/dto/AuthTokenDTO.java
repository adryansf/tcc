package iff.tcc.ajustado.entity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthTokenDTO {
    private String message;
    private String token;
}

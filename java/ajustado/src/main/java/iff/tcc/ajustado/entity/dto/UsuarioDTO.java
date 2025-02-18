package iff.tcc.ajustado.entity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioDTO {
    private JWTSubjectDTO usuario;
    private boolean gerente;
    private boolean cliente;
}

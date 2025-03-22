package iff.tcc.ajustado.exception.mapper;

import iff.tcc.ajustado.entity.dto.ExceptionDTO;
import iff.tcc.ajustado.exception.EmailOuSenhaInvalidoException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class EmailOuSenhaInvalidoExceptionMapper implements ExceptionMapper<EmailOuSenhaInvalidoException> {

    @Override
    public Response toResponse(EmailOuSenhaInvalidoException exception) {
        return Response.status(Response.Status.UNAUTHORIZED).entity(ExceptionDTO.builder().message(exception.getMessage()).build()).build();
    }
}

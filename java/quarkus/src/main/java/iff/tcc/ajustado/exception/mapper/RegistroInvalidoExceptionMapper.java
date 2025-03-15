package iff.tcc.ajustado.exception.mapper;

import iff.tcc.ajustado.exception.RegistroInvalidoException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class RegistroInvalidoExceptionMapper implements ExceptionMapper<RegistroInvalidoException> {

    @Override
    public Response toResponse(RegistroInvalidoException exception) {
        return Response.status(Response.Status.BAD_REQUEST).entity(exception.getMessage()).build();
    }
}

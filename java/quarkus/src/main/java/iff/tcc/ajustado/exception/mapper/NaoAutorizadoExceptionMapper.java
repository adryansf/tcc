package iff.tcc.ajustado.exception.mapper;

import iff.tcc.ajustado.entity.dto.ExceptionDTO;
import iff.tcc.ajustado.exception.NaoAutorizadoException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NaoAutorizadoExceptionMapper implements ExceptionMapper<NaoAutorizadoException> {

    @Override
    public Response toResponse(NaoAutorizadoException exception) {
        return Response.status(Response.Status.UNAUTHORIZED).entity(ExceptionDTO.builder().message(exception.getMessage()).build()).build();
    }
}

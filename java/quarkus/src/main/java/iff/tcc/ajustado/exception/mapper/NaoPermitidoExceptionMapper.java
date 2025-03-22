package iff.tcc.ajustado.exception.mapper;

import iff.tcc.ajustado.entity.dto.ExceptionDTO;
import iff.tcc.ajustado.exception.NaoPermitidoException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NaoPermitidoExceptionMapper implements ExceptionMapper<NaoPermitidoException> {

    @Override
    public Response toResponse(NaoPermitidoException exception) {
        return Response.status(Response.Status.FORBIDDEN).entity(ExceptionDTO.builder().message(exception.getMessage()).build()).build();
    }
}

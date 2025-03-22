package iff.tcc.ajustado.exception.mapper;

import iff.tcc.ajustado.entity.dto.ExceptionDTO;
import iff.tcc.ajustado.exception.NaoEncontradoException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NaoEncontradoExceptionMapper implements ExceptionMapper<NaoEncontradoException> {

    @Override
    public Response toResponse(NaoEncontradoException exception) {
        return Response.status(Response.Status.NOT_FOUND).entity(ExceptionDTO.builder().message(exception.getMessage()).build()).build();
    }
}

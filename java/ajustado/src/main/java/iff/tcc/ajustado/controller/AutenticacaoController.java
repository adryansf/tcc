package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.dto.AuthTokenDTO;
import iff.tcc.ajustado.entity.dto.LoginDTO;
import iff.tcc.ajustado.service.AutenticacaoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;

@Path("/auth/login")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AutenticacaoController {

    @Inject
    AutenticacaoService autenticacaoService;

    @POST
    @Path("/gerentes")
    public Response autenticarGerente(LoginDTO loginDTO) {
        return Response.ok(autenticacaoService.autorizarGerente(loginDTO)).build();
    }

    @POST
    @Path("/clientes")
    public Response autenticarCliente(LoginDTO loginDTO) {
        return Response.ok(autenticacaoService.autorizarCliente(loginDTO)).build();
    }
}

package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Transacao;
import iff.tcc.ajustado.entity.dto.TransacaoContaSemSaldoDTO;
import iff.tcc.ajustado.entity.dto.TransacaoDTO;
import iff.tcc.ajustado.service.TransacaoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/transacoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransacaoController {

    @Inject
    TransacaoService transacaoService;

    @GET
    @RolesAllowed({"gerente", "cliente"})
    public List<TransacaoContaSemSaldoDTO> getTransacoes(@QueryParam("idConta") UUID idConta) {
        return transacaoService.listar(idConta);
    }


    @GET
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public Transacao getTransacao(UUID id) {
        return transacaoService.buscar(id);
    }

    @POST
    @RolesAllowed({"cliente", "gerente"})
    public Response criarTransacao(TransacaoDTO transacao) {
        transacaoService.salvar(transacao);
        return Response.status(Response.Status.CREATED).build();
    }
}

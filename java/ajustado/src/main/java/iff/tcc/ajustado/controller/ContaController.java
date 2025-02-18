package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Conta;
import iff.tcc.ajustado.entity.dto.ContaDTO;
import iff.tcc.ajustado.entity.dto.ContaSemSaldoDTO;
import iff.tcc.ajustado.service.ContaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/contas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContaController {

    @Inject
    ContaService contaService;

    @GET
    @RolesAllowed({"gerente", "cliente"})
    public List<ContaSemSaldoDTO> getContas(@QueryParam("cpf") String cpf) {
        return contaService.listar(cpf);
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public Conta getConta(UUID id) {
        return contaService.buscarPorId(id);
    }

    @POST
    @RolesAllowed({"gerente", "cliente"})
    public Response criarConta(ContaDTO conta) {
        contaService.criar(conta);
        return Response.status(Response.Status.CREATED).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public void deletarConta(UUID id) {
        contaService.remover(id);
    }

}

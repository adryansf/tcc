package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Conta;
import iff.tcc.ajustado.entity.dto.ContaDTO;
import iff.tcc.ajustado.service.ContaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.UUID;

@Path("/contas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContaController {

    @Inject
    ContaService contaService;

    @GET
    @RolesAllowed("gerente")
    public List<Conta> getContas() {
        return contaService.listar();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public Conta getConta(UUID id) {
        return contaService.buscarPorId(id);
    }

    @POST
    @RolesAllowed({"gerente", "cliente"})
    public Conta criarConta(ContaDTO conta) {
        return contaService.criar(conta);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public void deletarConta(UUID id) {
        contaService.remover(id);
    }

}

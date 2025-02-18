package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Agencia;
import iff.tcc.ajustado.service.AgenciaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/agencias")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AgenciaController {
    @Inject
    private AgenciaService agenciaService;

    @GET
    @RolesAllowed({"gerente", "cliente"})
    public List<Agencia> listar() {
        return agenciaService.listar();
    }

    @GET
    @Path("/{id}")
    public Agencia buscarPorId(UUID id) {
        return agenciaService.buscarPorId(id);
    }

    @POST
    @RolesAllowed("gerente")
    public Response criar(Agencia agencia) {
        agenciaService.salvar(agencia);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @RolesAllowed("gerente")
    @Path("/{id}")
    public Agencia atualizar(UUID id, Agencia agencia) {
        return agenciaService.atualizar(id, agencia);
    }

    @DELETE
    @RolesAllowed("gerente")
    @Path("/{id}")
    public void deletar(UUID id) {
        agenciaService.deletar(id);
    }
}

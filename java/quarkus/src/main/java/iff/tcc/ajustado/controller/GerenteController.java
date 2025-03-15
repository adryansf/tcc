package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Gerente;
import iff.tcc.ajustado.entity.dto.GerenteDTO;
import iff.tcc.ajustado.service.GerenteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/gerentes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class GerenteController {

    @Inject
    GerenteService gerenteService;

    @GET
    public List<Gerente> listar() {
        return gerenteService.listar();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public Gerente buscar(UUID id) {
        return gerenteService.buscarPorId(id);
    }

    @POST
    @RolesAllowed("gerente")
    public Response criar(GerenteDTO gerente) {
        gerenteService.salvar(gerente);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("gerente")
    public Gerente atualizar(UUID id, GerenteDTO gerente) {
        return gerenteService.atualizar(id, gerente);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("gerente")
    public void deletar(UUID id) {
        gerenteService.delete(id);
    }
}

package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Endereco;
import iff.tcc.ajustado.entity.dto.EnderecoDTO;
import iff.tcc.ajustado.service.EnderecoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/enderecos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnderecoController {
    @Inject
    EnderecoService enderecoService;

    @GET
    @RolesAllowed("gerente")
    public List<Endereco> listar() {
        return enderecoService.listar();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public Endereco buscarPorId(UUID id) {
        return enderecoService.buscar(id);
    }

    @POST
    @RolesAllowed({"gerente", "cliente"})
    public Response criar(EnderecoDTO endereco) {
        enderecoService.criar(endereco);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public Endereco atualizar(UUID id, EnderecoDTO endereco) {
        return enderecoService.atualizar(id, endereco);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public void deletar(UUID id) {
        enderecoService.deletar(id);
    }
}

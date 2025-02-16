package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.service.ClienteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.UUID;

@Path("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteController {
    @Inject
    ClienteService clienteService;

    @GET
    @RolesAllowed({"gerente"})
    public Iterable<Cliente> listarClientes() {
        return clienteService.listar();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"cliente", "gerente"})
    public Cliente buscarCliente(@PathParam("id") UUID id) {
        return clienteService.buscarPorId(id);
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"cliente", "gerente"})
    public Cliente atualizarCliente(@PathParam("id") UUID id, Cliente cliente) {
        return clienteService.update(id, cliente);
    }

    @POST
    public Cliente criarCliente(Cliente cliente) {
        return clienteService.criar(cliente);
    }
}

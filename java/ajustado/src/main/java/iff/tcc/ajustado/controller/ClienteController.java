package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.service.ClienteService;
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
    @Path("/{id}")
    public Cliente buscarCliente(@PathParam("id") UUID id) {
        return clienteService.buscarPorId(id);
    }

    @POST
    public Cliente criarCliente(Cliente cliente) {
        return clienteService.criar(cliente);
    }
}

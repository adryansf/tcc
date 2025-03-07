package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Cliente;
import iff.tcc.ajustado.entity.Gerente;
import iff.tcc.ajustado.service.ClienteService;
import iff.tcc.ajustado.service.GerenteService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminController {

    @Inject
    GerenteService gerenteService;

    @Inject
    ClienteService clienteService;

    @GET
    @Path("/clientes")
    public List<Cliente> listarClientes(@QueryParam("quantidade") int quantidade) {
        return clienteService.listar(quantidade);
    }

    @GET
    @Path("/gerentes")
    public List<Gerente> listarGerentes(@QueryParam("quantidade") int quantidade) {
        return gerenteService.listar(quantidade);
    }

}

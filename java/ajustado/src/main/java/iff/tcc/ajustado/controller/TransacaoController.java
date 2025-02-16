package iff.tcc.ajustado.controller;

import iff.tcc.ajustado.entity.Transacao;
import iff.tcc.ajustado.entity.dto.TransacaoDTO;
import iff.tcc.ajustado.service.TransacaoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.UUID;

@Path("/transacoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransacaoController {

    @Inject
    TransacaoService transacaoService;

    @GET
    @RolesAllowed("gerente")
    public List<Transacao> getTransacoes() {
        return transacaoService.listar();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"gerente", "cliente"})
    public Transacao getTransacao(UUID id) {
        return transacaoService.buscar(id);
    }

    @POST
    @RolesAllowed({"cliente", "gerente"})
    public Transacao criarTransacao(TransacaoDTO transacao) {
        return transacaoService.salvar(transacao);
    }
}

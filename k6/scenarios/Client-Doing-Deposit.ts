import { LoginCliente } from "../BackendAdapter/BackendAdapter";


export default function () {
    var authToken = LoginCliente({email: cliente.email, senha: cliente.senha}).token
}
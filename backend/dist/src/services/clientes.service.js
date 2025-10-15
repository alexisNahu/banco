import * as clienteRepository from '../repositorios/clientes.repository.js';
import { ApiError, handleError, InternalServerError, NotFoundError } from "../apiErrores.js";
export async function getClienteById(id) {
    try {
        const cliente = await clienteRepository.getBdClienteById(`${id}`);
        if (!cliente)
            throw new NotFoundError('cliente no encontrado');
        return cliente;
    }
    catch (e) {
        handleError(e);
        throw e;
    }
}
export async function createCliente(cliente) {
    try {
        const newCliente = await clienteRepository.insertCliente(cliente);
        if (!newCliente)
            throw new InternalServerError('No se pudo insertar el cliente');
        return newCliente;
    }
    catch (e) {
        handleError(e);
        throw e;
    }
}

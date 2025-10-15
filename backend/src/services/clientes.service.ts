import * as clienteRepository from '../repositorios/clientes.repository.js'
import type {InsertCliente, SelectCliente} from "../db/schema.js";
import {ApiError, handleError, InternalServerError, NotFoundError} from "../apiErrores.js";

export async function getCliente(fields: Partial<SelectCliente>): Promise<SelectCliente[]> {
    try {
        return await clienteRepository.selectClientes(fields)
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function createCliente(cliente: InsertCliente): Promise<SelectCliente> {
    try {
        console.log(cliente)
        const newCliente: SelectCliente | undefined = await clienteRepository.insertCliente(cliente)
        console.log(newCliente)
        if (!newCliente) throw new InternalServerError('No se pudo insertar el cliente')
        return newCliente
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function deleteCliente(id: string): Promise<SelectCliente> {
    try {
        const cliente: SelectCliente | undefined = await clienteRepository.selectClienteById(id)
        if (!cliente) throw new NotFoundError('No se encontre al cliente a eliminar')
        await clienteRepository.deleteCliente(id)
        return cliente
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function updateCliente(id: string, cliente: Partial<SelectCliente>): Promise<{prevCliente: SelectCliente | undefined, updatedCliente: SelectCliente | undefined}> {
    try {
        const prevCliente = await clienteRepository.selectClienteById(id)
        await clienteRepository.updateCliente(cliente, id)
        const updatedCliente = await clienteRepository.selectClienteById(id)

        return {prevCliente, updatedCliente}
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function getClienteByNumeroIdentificacion(num: string) {
    try {
        const cliente: SelectCliente | undefined = await clienteRepository.selectClienteByNumeroIdentificacion(num)

        if (!cliente) throw new NotFoundError(`No se encontro al cliente con el numero de identificacion ${num}`)
        return cliente
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

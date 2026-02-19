import * as usuarioService from '../repositorios/usuario_sistema.repository.js'
import {ApiError, handleError, InternalServerError, NotFoundError} from "../apiErrores.js";
import {
    type InsertUsuarioSistema, type SelectCliente,
    type SelectUsuarioSistema,
} from "../db/schema.js";
import * as usuarioRepository from '../repositorios/usuario_sistema.repository.js'
import * as clienteRepository from "../repositorios/clientes.repository.js";

export async function getUsuarioSistemaById(id: string): Promise<SelectUsuarioSistema> {
    try {
        const usuario: SelectUsuarioSistema | undefined = await usuarioService.getApiUsuarioSistemaById(id)
        if (!usuario) throw new NotFoundError('no se encontro al usuario del sistema')

        return usuario
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

export async function getUsuarioSistemaByUsername(username: string): Promise<SelectUsuarioSistema> {
    try {
        const foundCliente: SelectUsuarioSistema | undefined = await usuarioRepository.getApiUsuarioSistemaByUsername(username)
        if (!foundCliente) throw new NotFoundError(`no se encontre al cliente con el username ${username}`)

        return foundCliente
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}



export async function getUsuariosSistema(fields: Partial<SelectUsuarioSistema>): Promise<SelectUsuarioSistema[]> {
    try {
        return await usuarioRepository.selectUsuariosSistema(fields)
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function updateUsuarioSistema(id: string, cliente: Partial<SelectUsuarioSistema>): Promise<{prevUsuario: SelectUsuarioSistema | undefined, updatedUsuario: SelectUsuarioSistema | undefined}> {
    try {
        console.log('en elservice', {id, cliente})
        const prevUsuario= await usuarioService.getApiUsuarioSistemaById(id)
        await usuarioRepository.updateUsuarioSistema(cliente, id)
        const updatedUsuario = await usuarioService.getApiUsuarioSistemaById(id)

        return {prevUsuario, updatedUsuario}
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function createUsuarioSistema(usuario: InsertUsuarioSistema): Promise<SelectUsuarioSistema> {
    try {
        const newUsuario: SelectUsuarioSistema | undefined = await usuarioRepository.createApiUsuarioSistema(usuario)
        if (!newUsuario) throw new InternalServerError('Error creando el usuario del sistema')

        return newUsuario
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}
import type {SelectCliente, SelectRol, SelectUsuarioSistema} from "../db/schema.js";
import type {LoginSchemaType, RegisterSchemaType} from "../models/zod_schemas/auth.schemas.js";
import * as usuarioService from './usuario_sistema.service.js'
import {ApiError, ConflictError, ForbiddenError, handleError, NotFoundError} from "../apiErrores.js";
import {compare, hash} from "bcrypt";
import {generateToken} from "./jwt.service.js";
import {config} from "../../config.js";
import {existsApiUsername} from "../repositorios/usuario_sistema.repository.js";
import {getClienteByNumeroIdentificacion} from "./clientes.service.js";
import * as rpService from './rol_permisos.service.js'
import type {RolNombreEnum} from "../models/models.js";

export async function login({username, password}: LoginSchemaType): Promise<{ access_token: string, refresh_token: string, foundUsuario: SelectUsuarioSistema }> {
    try {
        const foundUsuario: SelectUsuarioSistema | undefined = await usuarioService.getUsuarioSistemaByUsername(username)
        if (!foundUsuario) throw new ForbiddenError('Error en el usuario o la contraseña')

        const passwordValidation: boolean = await compare(password, foundUsuario.passwordHash)
        if (!passwordValidation) throw new ForbiddenError('Error en el usuario o la contraseña')

        const access_token: string = generateToken(foundUsuario, 2, config.jwt.secret)
        const refresh_token: string = generateToken(foundUsuario, 10, config.jwt.refreshSecret)

        return {access_token, refresh_token, foundUsuario}
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

export async function register({username, password, rol, numeroIdentificacion}: RegisterSchemaType) {
    try {
        const existsUsername: boolean = await existsApiUsername(username)
        if (existsUsername) throw new ConflictError('Ya existe un usuario registrado con este username, por favor escoja otro username')

        const passwordHash: string = await hash(password, 10)

        const role: SelectRol = await rpService.getRoleByName(rol as RolNombreEnum)

        const newUsuario: SelectUsuarioSistema = await usuarioService.createUsuarioSistema({
            username,
            estado: "activo",
            passwordHash,
            rolId: role.id
        })

        return newUsuario
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}
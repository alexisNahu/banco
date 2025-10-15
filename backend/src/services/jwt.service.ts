import jwt from 'jsonwebtoken'
import type {UsuarioSistemaPayload} from "../models/clientes.model.js";
import type {SelectUsuarioSistema} from "../db/schema.js";
import {config} from "../../config.js";

export function generateToken (usuario: SelectUsuarioSistema, expiresIn: number = 1, secret: string = config.jwt.secret): string {
    const payload: UsuarioSistemaPayload = {
        id: usuario.id,
        username: usuario.username,
        id_role: usuario.rolId
    }

    return jwt.sign(payload, secret, {
        expiresIn: `${expiresIn}h`,
        subject: usuario.username,
        algorithm: 'HS256'
    })
}


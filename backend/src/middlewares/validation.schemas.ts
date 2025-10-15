import type {NextFunction, Request, Response} from "express";
import {type ZodObject, type ZodTypeAny} from "zod";
import {generateToken} from "../services/jwt.service.js";
import jwt from "jsonwebtoken";
import {config} from "../../config.js";
import type {UsuarioSistemaPayload} from "../models/clientes.model.js";
import {getUsuarioSistemaById} from "../services/usuario_sistema.service.js";
import type {SelectUsuarioSistema} from "../db/schema.js";
import {ApiError, UnauthorizedError} from "../apiErrores.js";
import type {Permiso} from "../models/models.js";
import {getPermisosByRolId} from "../services/rol_permisos.service.js";

export type RequestSchema = ZodObject<{
    body?: ZodTypeAny;
    params?: ZodTypeAny;
    query?: ZodTypeAny;
}>;

interface AuthResponse extends Response {
    tokenPayload?: UsuarioSistemaPayload
}

export const validateSchema = <T extends RequestSchema>(schema: T) =>
    (req: Request, res: Response, next: NextFunction) => {
        const dataToValidate = {
            body: req.body,
            params: req.params,
            query: req.query,
        };
        const validation = schema.safeParse(dataToValidate);

        if (!validation.success) {
            return res.status(400).json({
                msg: "Error de validación, por favor verificar la petición",
                details: validation.error.issues,
            });
        }

        // Asignamos los valores parseados para que req tenga los tipos correctos
        if (validation.data.body) req.body = validation.data.body;

        next();
    };


export const validateToken = () => async (req: Request, res: AuthResponse, next: NextFunction) => {
    const access_token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token

    try {
        if (access_token) return next()


        if (!access_token && refresh_token) {
            const refreshTokenPayload: UsuarioSistemaPayload = jwt.verify(
                refresh_token,
                config.jwt.refreshSecret
            ) as UsuarioSistemaPayload;

            const usuario: SelectUsuarioSistema | undefined = await getUsuarioSistemaById(refreshTokenPayload.id);
            if (!usuario) {
                throw new UnauthorizedError('El usuario del refresh token no existe');
            }

            const newAccessToken: string = generateToken(usuario);

            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 // 1 hora
            });

            return next();
        }



        if (!access_token && !refresh_token) return res.status(400).send('Usuario no logeado o no autenticado')
    } catch (e: any) {
        console.error(e);
        return res.status(e instanceof ApiError ? e.statusCode : 500).json({msg: e.details})
    }
}

export const validatePermisos = (permisos_necesarios: Permiso[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token
        if (!token) return res.status(401).json({msg: 'Usuario sin token, posiblemente no esta logeado'})
        const userDecoded = (jwt.verify(token, config.jwt.secret)) as UsuarioSistemaPayload

        const usuario_permisos: string[] = await getPermisosByRolId(userDecoded.id_role) // estos serian los permisos del usuario segun su rol

        const tienePermisos = permisos_necesarios.every(rp => usuario_permisos.includes(rp)) // verificamos si el usuario tiene todos los permisos necesarios (los pasados por parametro)

        if (!tienePermisos) return res.status(401).json({msg: 'El usuario no tiene los permisos necesarios para esta accion'})

        next()
    } catch (e: any) {
        console.error(e); return res.status(e instanceof ApiError ? e.statusCode : 500).json({msg: e.details})
    }
}
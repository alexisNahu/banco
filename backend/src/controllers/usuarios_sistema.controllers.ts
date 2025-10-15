import * as usuarioService from '../services/usuario_sistema.service.js'
import type {Request, Response} from 'express'
import type {SelectCuenta, SelectUsuarioSistema} from "../db/schema.js";
import {ApiError, BadRequestError} from "../apiErrores.js";

export const usuariosSistemaControllers = {
    read: async (req: Request, res: Response) => {
        try {
            const usuarios: SelectUsuarioSistema[] = await usuarioService.getUsuariosSistema(req.query)
            return res.status(200).json({msg: usuarios.length ? 'usuarios obtenidos con exito' : `No se encontro ningun usuario con esos parametros, ${JSON.stringify(req.query)}` , data: usuarios})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            if (!id) throw new BadRequestError('No se especifico la id o su formato es incorrecto')
            const {prevUsuario, updatedUsuario} = await usuarioService.updateUsuarioSistema(id, req.body)
            return res.status(200).json({msg: 'usuario actualizado con exito', registro_previo: prevUsuario, registro_actualizado: updatedUsuario})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    }
}
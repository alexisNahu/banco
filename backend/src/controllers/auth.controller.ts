import type {Response, Request} from "express";
import * as authService from '../services/auth.service.js'
import {ApiError} from "../apiErrores.js";
import type {SelectUsuarioSistema} from "../db/schema.js";
import jwt from "jsonwebtoken";
import {config} from "../../config.js";
import type {UsuarioSistemaPayload} from "../models/clientes.model.js";
import {getCliente} from "../services/clientes.service";
import {getUsuarioSistemaById} from "../services/usuario_sistema.service";

export const authController = {
    register: async (req: Request, res: Response)=> {
        try {
            const {
                username,
                password,
                rol,
                numeroIdentificacion,
            } = req.body

            console.log('jahdslkfjad', username, password, rol, numeroIdentificacion)

            const newUser: SelectUsuarioSistema = await authService.register({repeat_password: "", username, password, rol, numeroIdentificacion})

            return res.status(200).json({msg: 'usuario en el sistema registrado correctamente', usuario_nuevo: newUser})
        } catch(e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({msg: 'error registrado al nuevo usuario', details: e.message})
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const {
                username,
                password
            } = req.body

            const {access_token, refresh_token, foundUsuario} = await authService.login({username, password})


            res
                .cookie('access_token', access_token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60
                })
                .cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 7000 * 60 * 60
                })

            return res.status(200).json({msg: 'usuario logeado correctamente', access_token, refresh_token, usuario: foundUsuario})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({msg: 'error logeando al nuevo usuario', details: e.message})
        }
    },
    logout: async (req: Request, res: Response) =>  {
        try {
            const activeUser = jwt.verify(req.cookies.access_token, config.jwt.secret) as UsuarioSistemaPayload

            res.clearCookie('access_token', {
                httpOnly: true,
                sameSite: 'strict'
            })
            res.clearCookie('refresh_token', {
                httpOnly: true,
                sameSite: 'strict'
            })
            res.status(200).json({msg: 'Logout succesfull'})
        } catch (e:any) {
            res.status(400).json({msg: 'Something went wrong', details: e.message})
        }
    },
    me: async (req: Request, res: Response) => {
        try {
            const activeUser = jwt.verify(req.cookies.access_token, config.jwt.secret) as UsuarioSistemaPayload
            const user = await getUsuarioSistemaById(activeUser.id)

            res.status(200).json({...activeUser, clienteId: user.clienteId ? (await getCliente({id: user.clienteId}))[0].id : null})
        } catch (e) {
            res.status(400)
        }
    }
}
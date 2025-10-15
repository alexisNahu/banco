import * as clientesService from '../services/clientes.service.js'
import type {Request, Response} from 'express'
import type {SelectCliente} from "../db/schema.js";
import {ApiError, BadRequestError} from "../apiErrores.js";

export const clientesController = {
    create: async (req: Request, res: Response) => {
        try {
            const newCliente: SelectCliente = await clientesService.createCliente(req.body)
            return res.status(200).json({msg: 'Cliente registrado con exito', data: newCliente})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    },
    read: async (req: Request, res: Response) => {
        try {
            const clientes: SelectCliente[] = await clientesService.getCliente(req.query)
            return res.status(200).json({msg: clientes.length ? 'Clientes obtenidos con exito' : `No se encontro ningun cliente con esos parametros, ${JSON.stringify(req.query)}` , data: clientes})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            if (!id) throw new BadRequestError('No se especifico la id o su formato es incorrecto')
            const {prevCliente, updatedCliente} = await clientesService.updateCliente(id, req.body)
            return res.status(200).json({msg: 'cliente actualizado con exito', registro_previo: prevCliente, registro_actualizado: updatedCliente})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            if (!id) throw new BadRequestError('No se especifico la id o su formato es incorrecto')
            const deletedCliente = await clientesService.deleteCliente(id)
            return res.status(200).json({msg: 'cliente eliminado con exito', registro_eliminado: deletedCliente})
        }catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    }
}
import * as cuentasService from '../services/cuentas.service.js'
import type {Request, Response} from 'express'
import type {SelectCuenta} from "../db/schema.js";
import {ApiError, BadRequestError} from "../apiErrores.js";

export const cuentasController = {
    create: async (req: Request, res: Response) => {
        try {
            const newCuenta: SelectCuenta = await cuentasService.createCuenta(req.body)
            return res.status(200).json({msg: 'Cuenta registrada con exito', data: newCuenta})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    },
    read: async (req: Request, res: Response) => {
        try {
            const cuentas: SelectCuenta[] = await cuentasService.getCuentas(req.query)
            return res.status(200).json({msg: cuentas.length ? 'Cuentas obtenidas con exito' : `No se encontro ninguna cuenta con esos parametros, ${JSON.stringify(req.query)}` , data: cuentas})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            if (!id) throw new BadRequestError('No se especifico la id o su formato es incorrecto')
            const {prevCuenta, updatedCuenta} = await cuentasService.updateCuenta(id, req.body)
            return res.status(200).json({msg: 'cuenta actualizada con exito', registro_previo: prevCuenta, registro_actualizado: updatedCuenta})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            if (!id) throw new BadRequestError('No se especifico la id o su formato es incorrecto')
            const deletedCuenta = await cuentasService.deleteCuenta(id)
            return res.status(200).json({msg: 'cuenta eliminada con exito', registro_eliminado: deletedCuenta})
        }catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    }
}
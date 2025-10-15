import * as tarjetasService from '../services/tarjetas.service.js'
import type { Request, Response } from 'express'
import type { SelectTarjeta } from "../db/schema.js"
import { ApiError, BadRequestError } from "../apiErrores.js"

export const tarjetasController = {
    create: async (req: Request, res: Response) => {
        try {
            const newTarjeta: SelectTarjeta = await tarjetasService.createTarjeta(req.body)
            return res.status(200).json({
                msg: 'Tarjeta registrada con éxito',
                data: newTarjeta
            })
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message })
        }
    },

    read: async (req: Request, res: Response) => {
        try {
            const tarjetas: SelectTarjeta[] = await tarjetasService.getTarjetas(req.query)
            return res.status(200).json({
                msg: tarjetas.length
                    ? 'Tarjetas obtenidas con éxito'
                    : `No se encontró ninguna tarjeta con esos parámetros, ${JSON.stringify(req.query)}`,
                data: tarjetas
            })
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            if (!id) throw new BadRequestError('No se especificó la id o su formato es incorrecto')

            const { prevTarjeta, updatedTarjeta } = await tarjetasService.updateTarjeta(id, req.body)
            return res.status(200).json({
                msg: 'Tarjeta actualizada con éxito',
                registro_previo: prevTarjeta,
                registro_actualizado: updatedTarjeta
            })
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            if (!id) throw new BadRequestError('No se especificó la id o su formato es incorrecto')

            const deletedTarjeta = await tarjetasService.deleteTarjeta(id)
            return res.status(200).json({
                msg: 'Tarjeta eliminada con éxito',
                registro_eliminado: deletedTarjeta
            })
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message })
        }
    }
}

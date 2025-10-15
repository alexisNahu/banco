import type {Request, Response} from 'express'
import * as transaccionService from '../services/transacciones.service.js'
import {ApiError} from "../apiErrores.js";
import type {SelectCuenta, SelectTransaccion} from "../db/schema.js";

export const transaccionControllers = {
    create: async (req: Request, res: Response) => {
        try {
            const { transaccion, estado, razon } = await transaccionService.procesarTransaccion(req.body);

            res.status(200).json({
                mensaje: `Transacción ${estado} exitosamente`,
                data: transaccion,
                estado: estado,
                razon: razon,
            });

        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({
                error: 'Error procesando transacción',
                detalles: e.message
            });
        }
    },
    read: async (req: Request, res: Response) => {
        try {
            const transacciones: SelectTransaccion[] = await transaccionService.getTransaccion(req.query)
            return res.status(200).json({msg: transacciones.length ? 'Transacciones obtenidas con exito' : `No se encontro ninguna transaccion con esos parametros, ${JSON.stringify(req.query)}` , data: transacciones})
        } catch (e: any) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({details: e.message})
        }
    },
}
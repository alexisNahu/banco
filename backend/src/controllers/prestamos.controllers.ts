import * as prestamosService from '../services/prestamos.service.js';
import type { Request, Response } from 'express';
import type { SelectPrestamo } from '../db/schema.js';
import { ApiError, BadRequestError } from '../apiErrores.js';

export const prestamosController = {
    /**
     * Crear un nuevo préstamo
     */
    create: async (req: Request, res: Response) => {
        try {
            const newPrestamo: SelectPrestamo = await prestamosService.createPrestamo(req.body);
            return res.status(200).json({
                msg: 'Préstamo registrado con éxito',
                data: newPrestamo,
            });
        } catch (e: any) {
            res
                .status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message });
        }
    },

    /**
     * Obtener préstamos (todos o filtrados)
     */
    read: async (req: Request, res: Response) => {
        try {
            const prestamos: SelectPrestamo[] = await prestamosService.getPrestamos(req.query);
            return res.status(200).json({
                msg: prestamos.length
                    ? 'Préstamos obtenidos con éxito'
                    : `No se encontró ningún préstamo con los parámetros: ${JSON.stringify(req.query)}`,
                data: prestamos,
            });
        } catch (e: any) {
            res
                .status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message });
        }
    },

    /**
     * Actualizar datos de un préstamo
     */
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id)
                throw new BadRequestError(
                    'No se especificó la id o su formato es incorrecto'
                );

            const { prevPrestamo, updatedPrestamo } = await prestamosService.updatePrestamo(
                id,
                req.body
            );

            return res.status(200).json({
                msg: 'Préstamo actualizado con éxito',
                registro_previo: prevPrestamo,
                registro_actualizado: updatedPrestamo,
            });
        } catch (e: any) {
            res
                .status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message });
        }
    },

    /**
     * Eliminar un préstamo
     */
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id)
                throw new BadRequestError(
                    'No se especificó la id o su formato es incorrecto'
                );

            const deletedPrestamo = await prestamosService.deletePrestamo(id);

            return res.status(200).json({
                msg: 'Préstamo eliminado con éxito',
                registro_eliminado: deletedPrestamo,
            });
        } catch (e: any) {
            res
                .status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message });
        }
    },
    pagarPrestamo: async (req: Request, res: Response) => {
        try {
            const {prestamoId} = req.params;

            if (!prestamoId) throw new BadRequestError('No se envio el prestamo id por parametro')

            const {cuentaId} = req.body;

            const {prevPrestamo, updatedPrestamo} = await prestamosService.pagarPrestamo(prestamoId, cuentaId)

            return res.status(200).json({
                msg: 'Prestamo pagado correctamente',
                prestamo_previo: prevPrestamo,
                prestamo_actualizado: updatedPrestamo
            })
        } catch (e: any) {
            res
                .status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message });
        }
    },
    rechazarPrestamo: async (req: Request, res: Response) => {
        try {
            const {prestamoId} = req.params;
            const {prestamo_rechazado} = req.body
            if (!prestamoId) throw new BadRequestError('No se envio el prestamo id por parametro')

            const {prevPrestamo, updatedPrestamo} = await prestamosService.rechazarPrestamo(prestamoId, prestamo_rechazado)

            return res.status(200).json({
                msg: 'Prestamo rechazado correctamente',
                prestamo_previo: prevPrestamo,
                prestamo_actualizado: updatedPrestamo
            })
        } catch (e: any) {
            res
                .status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message });
        }
    },
    aprobarPrestamo: async (req: Request, res: Response) => {
        try {
            const {prestamoId} = req.params;

            if (!prestamoId) throw new BadRequestError('No se envio el prestamo id por parametro')

            const {prevPrestamo, updatedPrestamo} = await prestamosService.aceptarPrestamo(prestamoId)

            return res.status(200).json({
                msg: 'Prestamo aprobado correctamente',
                prestamo_previo: prevPrestamo,
                prestamo_actualizado: updatedPrestamo
            })
        } catch (e: any) {
            res
                .status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message });
        }
    },
    marcarPrestamoMoroso: async (req: Request, res: Response) => {
        try {
            const {prestamoId} = req.params;
            const {prestamo_moroso} = req.body
            if (!prestamoId) throw new BadRequestError('No se envio el prestamo id por parametro')

            const {prevPrestamo, updatedPrestamo} = await prestamosService.marcarMoroso(prestamoId)

            return res.status(200).json({
                msg: 'Prestamo marcado como moroso correctamente',
                prestamo_previo: prevPrestamo,
                prestamo_actualizado: updatedPrestamo
            })
        } catch (e: any) {
            res
                .status(e instanceof ApiError ? e.statusCode : 500)
                .json({ details: e.message });
        }
    },

};

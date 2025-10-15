import * as prestamosRepository from '../repositorios/prestamos.repository.js';
import type { InsertPrestamo, SelectPrestamo } from '../db/schema.js';
import {
    ApiError, ConflictError,
    handleError,
    InternalServerError,
    NotFoundError,
} from '../apiErrores.js';
import type {
    CreatePrestamoType,
    RechazarPrestamoType
} from "../models/zod_schemas/prestamos.schemas.js";
import * as cuentasService from './cuentas.service.js'

/**
 * Obtener uno o varios préstamos según filtros
 */
export async function getPrestamos(
    filters: Partial<SelectPrestamo>
): Promise<SelectPrestamo[]> {
    try {
        return await prestamosRepository.selectPrestamos(filters);
    } catch (e) {
        handleError(e as ApiError);
        throw e;
    }
}

/**
 * Crear un nuevo préstamo
 */
export async function createPrestamo(
    prestamo: CreatePrestamoType
): Promise<SelectPrestamo> {
    try {
        const newPrestamo = await prestamosRepository.insertPrestamo(
            {
                estado: 'solicitado',
                clienteId: prestamo.clienteId,
                cuentaId: prestamo.cuentaId,
                montoSolicitado: `${prestamo.montoSolicitado}`,
                tasaInteres: `${prestamo.tasaInteres}`,
                plazoMeses: prestamo.plazoMeses,
                cuotaMensual: `${calcularCuotaMensual(prestamo.montoSolicitado, Number(prestamo.tasaInteres), prestamo.plazoMeses)}`,
            }
        );
        if (!newPrestamo) throw new InternalServerError('No se pudo insertar el préstamo');
        return newPrestamo;
    } catch (e) {
        handleError(e as ApiError);
        throw e;
    }
}

/**
 * Obtener un préstamo por su ID
 */
export async function getPrestamoById(id: string): Promise<SelectPrestamo> {
    try {
        const prestamo = await prestamosRepository.selectPrestamoById(id);
        if (!prestamo) throw new NotFoundError(`No se encontró el préstamo con id ${id}`);
        return prestamo;
    } catch (e) {
        handleError(e as ApiError);
        throw e;
    }
}

/**
 * Obtener préstamos de un cliente específico
 */
export async function getPrestamosByClienteId(
    clienteId: string
): Promise<SelectPrestamo[]> {
    try {
        const prestamos = await prestamosRepository.selectPrestamosByClienteId(clienteId);
        if (!prestamos || prestamos.length === 0)
            throw new NotFoundError(`El cliente ${clienteId} no tiene préstamos registrados`);
        return prestamos;
    } catch (e) {
        handleError(e as ApiError);
        throw e;
    }
}

/**
 * Actualizar datos de un préstamo
 */
export async function updatePrestamo(
    id: string,
    fields: Partial<SelectPrestamo>
): Promise<{ prevPrestamo: SelectPrestamo | undefined; updatedPrestamo: SelectPrestamo | undefined }> {
    try {
        const prevPrestamo = await prestamosRepository.selectPrestamoById(id);
        if (!prevPrestamo)
            throw new NotFoundError(`No se encontró el préstamo con id ${id} para actualizar`);

        await prestamosRepository.updatePrestamo(fields, id);
        const updatedPrestamo = await prestamosRepository.selectPrestamoById(id);

        return { prevPrestamo, updatedPrestamo };
    } catch (e) {
        handleError(e as ApiError);
        throw e;
    }
}

/**
 * Eliminar un préstamo
 */
export async function deletePrestamo(id: string): Promise<SelectPrestamo> {
    try {
        const prestamo = await prestamosRepository.selectPrestamoById(id);
        if (!prestamo)
            throw new NotFoundError(`No se encontró el préstamo a eliminar con id ${id}`);

        await prestamosRepository.deletePrestamo(id);
        return prestamo;
    } catch (e) {
        handleError(e as ApiError);
        throw e;
    }
}

function calcularCuotaMensual(
    montoAprobado: number,
    tasaInteres: number,
    plazoMeses: number
): number {
    const tasaDecimal = tasaInteres / 100;

    const cuota = montoAprobado *
        (tasaDecimal * Math.pow(1 + tasaDecimal, plazoMeses)) /
        (Math.pow(1 + tasaDecimal, plazoMeses) - 1);

    return Math.round(cuota * 100) / 100;
}



export async function aceptarPrestamo(prestamoId: string) {
    try {
        const prestamo = await getPrestamoById(prestamoId)

        const prestamoNuevo: SelectPrestamo = {
            ...prestamo,
            estado: 'aprobado',
            fechaAprobacion: new Date(),
            permitir_modifcacion: false
        }

        const {prevPrestamo, updatedPrestamo} =  await updatePrestamo(prestamoId, prestamoNuevo)

        const cuenta = await cuentasService.getCuentaById(prestamo.cuentaId)

        await cuentasService.updateMontoDeLaCuenta(prestamo.cuentaId, 'agregar', {valor: Number(prestamoNuevo.montoAprobado), moneda: cuenta.moneda})

        return {prevPrestamo, updatedPrestamo}
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function rechazarPrestamo (prestamoId: string, prestamo_rechazado: RechazarPrestamoType) {
    try {
        const prestamo = await getPrestamoById(prestamoId)

        if (!prestamo.permitir_modifcacion) throw new ConflictError('Este prestamo ya a sido aprobado o rechazado y no puede ser modificado')

        const prestamoNuevo: SelectPrestamo = {
            ...prestamo,
            ...prestamo_rechazado,
            estado: 'rechazado',
            permitir_modifcacion: false
        }

        return await updatePrestamo(prestamoId, prestamoNuevo)
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

export async function pagarPrestamo(prestamoId: string, cuentaId: string) {
    try {


        const prestamo = await getPrestamoById(prestamoId)
        const cuenta = await cuentasService.getCuentaById(cuentaId)

        const prestamoNuevo: SelectPrestamo = {
            ...prestamo,
            estado: 'pagado'
        }

        await cuentasService.updateMontoDeLaCuenta(cuentaId, 'disminuir', {valor: Number(prestamo.cuotaMensual), moneda: cuenta.moneda})

        return await updatePrestamo(prestamoId, prestamoNuevo)
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

export async function marcarMoroso(prestamoId: string) {
    try {
        const prestamo = await getPrestamoById(prestamoId)

        if (!prestamo.permitir_modifcacion) throw new ConflictError('Este prestamo ya a sido aprobado o rechazado y no puede ser modificado')

        const prestamoNuevo: SelectPrestamo = {
            ...prestamo,
            estado: 'moroso'
        }

        return await updatePrestamo(prestamoId, prestamoNuevo)
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

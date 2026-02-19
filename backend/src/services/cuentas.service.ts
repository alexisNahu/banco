import * as cuentaRepository from '../repositorios/cuentas.repository.js';
import {type InsertCuenta, type SelectCliente, type SelectCuenta} from "../db/schema.js";
import {ApiError, handleError, InternalServerError, NotFoundError} from "../apiErrores.js";
import type {CreateCuentaType, CuentaQueryData} from "../models/zod_schemas/cuentas.schemas.js";
import {getClienteByNumeroIdentificacion} from "./clientes.service.js";
import {convertirMoneda} from "../utils/conversionMoneda.utility.js";

export async function getCuentas(fields: CuentaQueryData): Promise<SelectCuenta[]> {
    try {
        const res = await cuentaRepository.selectCuentas(fields)
        console.log(res)
        return res
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function createCuenta(cuenta: CreateCuentaType): Promise<SelectCuenta> {
    try {
        const cliente: SelectCliente | undefined = await getClienteByNumeroIdentificacion(`${cuenta.numeroIdentificacion}`)
        if (!cliente) throw new NotFoundError(`No se encontro al cliente con el id ${cuenta.numeroIdentificacion}`)

        const cuentaInsert: InsertCuenta = { ...cuenta,
            clienteId: cliente.id,
            estado: 'activa' as const,
            saldoActual: '0',
            saldoDisponible: '0'}

        const newCuenta: SelectCuenta | undefined = await cuentaRepository.insertCuenta(cuentaInsert)
        if (!newCuenta) throw new InternalServerError('No se pudo insertar la cuenta')
        return newCuenta
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function deleteCuenta(id: string): Promise<SelectCuenta> {
    try {
        const cuenta: SelectCuenta | undefined = await cuentaRepository.selectCuentaById(id)
        if (!cuenta) throw new NotFoundError('No se encontro la cuenta a eliminar')

        await cuentaRepository.deleteCuenta(id)
        return cuenta
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function updateMontoDeLaCuenta(
    id: string,
    accion: 'disminuir' | 'agregar',
    monto: {valor: number, moneda: 'PYG' | 'USD'}
) {
    try {
        const cuenta: SelectCuenta = await getCuentaById(id);
        const montoConvertido = convertirMoneda(monto.valor, monto.moneda, cuenta.moneda);

        // Calcular nuevos saldos
        const nuevoSaldoActual = accion === 'agregar'
            ? Number(cuenta.saldoActual) + montoConvertido
            : Number(cuenta.saldoActual) - montoConvertido;

        const nuevoSaldoDisponible = accion === 'agregar'
            ? Number(cuenta.saldoDisponible) + montoConvertido
            : Number(cuenta.saldoDisponible) - montoConvertido;

        if (nuevoSaldoActual < 0 || nuevoSaldoDisponible < 0) {
            throw new Error('No se tiene el sado para la operacion');
        }

        return await updateCuenta(cuenta.id, {
            saldoActual: `${nuevoSaldoActual}`,
            saldoDisponible: `${nuevoSaldoDisponible}`
        });

    } catch (e: any) {
        handleError(e as ApiError);
        throw e;
    }
}

export async function updateCuenta(id: string, fields: Partial<SelectCuenta>): Promise<{prevCuenta: SelectCuenta | undefined, updatedCuenta: SelectCuenta | undefined}> {
    try {
        const prevCuenta: SelectCuenta | undefined = await cuentaRepository.selectCuentaById(id)
        if (!prevCuenta) throw new NotFoundError('No se encontro la cuenta con ese id')
        await cuentaRepository.updateCuenta(fields, id)
        const updatedCuenta: SelectCuenta | undefined = await cuentaRepository.selectCuentaById(id)
        if (!updatedCuenta) throw new InternalServerError('Error actualizando la cuenta')
        return {prevCuenta, updatedCuenta}
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function getCuentaByNumeroCuenta(num: string): Promise<SelectCuenta> {
    try {
        const cuenta: SelectCuenta | undefined = await cuentaRepository.selectCuentaByNumeroCuenta(num)

        if (!cuenta) throw new NotFoundError(`No se encontro la cuenta con el numero ${num}`)
        return cuenta
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function getCuentasByClienteId(id: string): Promise<SelectCuenta[]> {
    try {
        const cuentas: SelectCuenta[] | undefined = await cuentaRepository.selectCuentasByClienteId(id)
        if (!cuentas) throw new NotFoundError(`No se encontraron cuentas para el cliente con id ${id}`)
        return cuentas
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function getCuentaById(id: string): Promise<SelectCuenta> {
    try {
        const cuentas: SelectCuenta | undefined = await cuentaRepository.selectCuentaById(id)

        if (!cuentas) throw new NotFoundError(`No se encontro ninguna cuenta con el id ${id}`)
        return cuentas
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}
import {Clientes, Cuentas, type InsertCuenta, type SelectCuenta} from "../db/schema.js";
import {db} from "../db/connection.js";
import {and, eq} from "drizzle-orm";
import type {CuentaQueryData} from "../models/zod_schemas/cuentas.schemas.js";
import type {ClienteQueryData} from "../models/zod_schemas/clientes.schemas.js";
import {BadRequestError} from "../apiErrores.js";
import CuentasRouter from "../routers/cuentas.router.js";

export async function insertCuenta(cuenta: InsertCuenta): Promise<SelectCuenta | undefined> {
    try {
        const [result] = await db.insert(Cuentas).values(cuenta).returning();
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function selectCuentaById(id: string): Promise<SelectCuenta | undefined> {
    try {
        const [result] = await db.select().from(Cuentas).where(eq(Cuentas.id, id));
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function selectCuentaByNumeroCuenta(numCuenta: string): Promise<SelectCuenta | undefined> {
    try {
        const [result] = await db.select().from(Cuentas).where(eq(Cuentas.numeroCuenta, numCuenta));
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function selectCuentas(fields: CuentaQueryData): Promise<SelectCuenta[]> {
    try {
        console.log(fields)
        console.log(fields.clienteId)
        const conditions = [];

        if (fields.id) conditions.push(eq(Cuentas.id, fields.id));
        if (fields.clienteId) conditions.push(eq(Cuentas.clienteId, fields.clienteId));
        if (fields.numeroCuenta) conditions.push(eq(Cuentas.numeroCuenta, fields.numeroCuenta));
        if (fields.tipoCuenta) conditions.push(eq(Cuentas.tipoCuenta, fields.tipoCuenta));
        if (fields.moneda) conditions.push(eq(Cuentas.moneda, fields.moneda));
        if (fields.estado) conditions.push(eq(Cuentas.estado, fields.estado));

        console.log(conditions)

        if (conditions.length > 0) {
            return await db.select().from(Cuentas).where(and(...conditions));
        } else {
            return await db.select().from(Cuentas);
        }
    } catch (e) {
        console.error("Error obteniendo cuentas en selectCuentas", e);
        throw e;
    }
}

export async function selectCuentasByClienteId(id: string): Promise<SelectCuenta[] | undefined> {
    try {
        return await db.select().from(Cuentas).where(eq(Cuentas.clienteId, id))
    } catch (e) {
        console.error(e); throw e
    }
}

export async function updateCuenta(fields: CuentaQueryData, id: string): Promise<void> {
    try {
        const { id: _, ...updateFields } = fields;
        await db.update(Cuentas).set(updateFields).where(eq(Cuentas.id, id))
    } catch (e: any) {
        console.log('Error actualizando la cuenta');
        if (e.message === 'No values to set') throw new BadRequestError('Error, corroborar campos del cuerpo de la petición')
        throw e
    }
}

export async function deleteCuenta(id: string): Promise<void> {
    try {
        await db.select().from(Cuentas).where(eq(Cuentas.id, id))
    } catch (e) {
        console.error(e); throw e
    }
}
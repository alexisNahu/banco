import {
    type InsertTransaccion,
    type SelectTransaccion,
    Transacciones
} from "../db/schema.js";
import {db} from "../db/connection.js";
import {and, eq, gte, lte} from "drizzle-orm";
import type {TransaccionQueryData} from "../models/zod_schemas/transacciones.schemas.js";

export async function insertTransaccion (transaccion: InsertTransaccion): Promise<SelectTransaccion | undefined> {
    try {
        const [result] = await db.insert(Transacciones).values(transaccion).returning()
        return result
    } catch (e) {
        console.error(e); throw e
    }
}

export async function selectTransaccionById (id: string): Promise<SelectTransaccion | undefined> {
    try {
        const [result] = await db.select().from(Transacciones)
        return result
    } catch (e) {
        console.error(e); throw e
    }
}

export async function selectTransacciones (
    fields: TransaccionQueryData
): Promise<SelectTransaccion[]> {
    try {
        const conditions = [];

        if (fields.id) conditions.push(eq(Transacciones.id, fields.id));
        if (fields.tipoTransaccion) conditions.push(eq(Transacciones.tipoTransaccion, fields.tipoTransaccion));
        if (fields.cuentaOrigenId) conditions.push(eq(Transacciones.cuentaOrigenId, fields.cuentaOrigenId));
        if (fields.cuentaDestinoId) conditions.push(eq(Transacciones.cuentaDestinoId, fields.cuentaDestinoId));
        if (fields.cajeroId) conditions.push(eq(Transacciones.cajeroId, fields.cajeroId));
        if (fields.servicioId) conditions.push(eq(Transacciones.servicioId, fields.servicioId));
        if (fields.moneda) conditions.push(eq(Transacciones.moneda, fields.moneda));
        if (fields.estado) conditions.push(eq(Transacciones.estado, fields.estado));

        // filtros de rango de fechas (ejemplo)
        if (fields.fechaDesde && fields.fechaHasta) {
            conditions.push(and(
                gte(Transacciones.fechaHoraTransaccion, fields.fechaDesde),
                lte(Transacciones.fechaHoraTransaccion, fields.fechaHasta)
            ));
        }

        if (conditions.length > 0) {
            return await db.select().from(Transacciones).where(and(...conditions));
        } else {
            return await db.select().from(Transacciones);
        }
    } catch (e) {
        console.error("Error obteniendo transacciones en getBdTransacciones", e);
        throw e;
    }
}



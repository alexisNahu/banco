import {
    Clientes,
    type InsertTarjeta,
    type SelectTarjeta,
    Tarjetas,
} from "../db/schema.js";
import { db } from "../db/connection.js";
import { and, eq } from "drizzle-orm";
import type { TarjetaQueryData } from "../models/zod_schemas/tarjetas.schemas.js";
import type {ClienteQueryData} from "../models/zod_schemas/clientes.schemas.js";
import {BadRequestError} from "../apiErrores.js";

// ─── Insert ─────────────────────────────────────────────
export async function insertTarjeta(
    tarjeta: InsertTarjeta
): Promise<SelectTarjeta | undefined> {
    try {
        const [result] = await db.insert(Tarjetas).values(tarjeta).returning();
        return result;
    } catch (e) {
        console.error("Error insertando tarjeta:", e);
        throw e;
    }
}

// ─── Select By Id ──────────────────────────────────────
export async function selectTarjetaById(
    id: string
): Promise<SelectTarjeta | undefined> {
    try {
        const [result] = await db
            .select()
            .from(Tarjetas)
            .where(eq(Tarjetas.id, id));
        return result;
    } catch (e) {
        console.error("Error obteniendo tarjeta por id:", e);
        throw e;
    }
}

// ─── Select With Filters ───────────────────────────────
export async function selectTarjetas(
    fields: TarjetaQueryData
): Promise<SelectTarjeta[]> {
    try {
        const conditions = [];

        if (fields.id) conditions.push(eq(Tarjetas.id, fields.id));
        if (fields.cuentaId) conditions.push(eq(Tarjetas.cuentaId, fields.cuentaId));
        if (fields.numeroTarjeta) conditions.push(eq(Tarjetas.numeroTarjeta, fields.numeroTarjeta));
        if (fields.tipoTarjeta) conditions.push(eq(Tarjetas.tipoTarjeta, fields.tipoTarjeta));
        if (fields.estado) conditions.push(eq(Tarjetas.estado, fields.estado));

        return await db.select().from(Tarjetas).where(and(...conditions));
    } catch (e) {
        console.error("Error obteniendo tarjetas:", e);
        throw e;
    }
}

// ─── Delete ────────────────────────────────────────────
export async function deleteTarjeta(
    id: string
): Promise<SelectTarjeta | undefined> {
    try {
        const [result] = await db.delete(Tarjetas).where(eq(Tarjetas.id, id)).returning();
        return result;
    } catch (e) {
        console.error("Error eliminando tarjeta:", e);
        throw e;
    }
}

export async function updateTarjeta(fields: TarjetaQueryData, id: string): Promise<SelectTarjeta | undefined> {
    try {
        const { id: _, ...updateFields } = fields;
        const [response] = await db.update(Tarjetas).set(updateFields).where(eq(Tarjetas.id, id)).returning()
        return response
    } catch (e: any) {
        console.log('Error actualizando tarjetas');
        if (e.message === 'No values to set') throw new BadRequestError('Error, corroborar campos del cuerpo de la tarjetas')
        throw e
    }
}
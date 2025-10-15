import { db } from "../db/connection.js";
import {
    Prestamos,
    type InsertPrestamo,
    type SelectPrestamo,
} from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { BadRequestError } from "../apiErrores.js";

export async function selectPrestamoById(id: string): Promise<SelectPrestamo | undefined> {
    try {
        const [prestamo]: SelectPrestamo[] = await db
            .select()
            .from(Prestamos)
            .where(eq(Prestamos.id, id))
            .limit(1);

        return prestamo;
    } catch (e) {
        console.error("Error obteniendo préstamo por ID:", e);
        throw e;
    }
}

export async function selectPrestamosByClienteId(clienteId: string): Promise<SelectPrestamo[]> {
    try {
        return await db
            .select()
            .from(Prestamos)
            .where(eq(Prestamos.clienteId, clienteId));
    } catch (e) {
        console.error("Error obteniendo préstamos por cliente:", e);
        throw e;
    }
}

/**
 * Insertar un nuevo préstamo
 */
export async function insertPrestamo(prestamo: InsertPrestamo): Promise<SelectPrestamo | undefined> {
    try {
        const [newPrestamo]: SelectPrestamo[] = await db
            .insert(Prestamos)
            .values(prestamo)
            .returning();

        return newPrestamo;
    } catch (e) {
        console.error("Error insertando préstamo:", e);
        throw e;
    }
}

/**
 * Actualizar datos de un préstamo
 */
export async function updatePrestamo(
    fields: Partial<SelectPrestamo>,
    id: string
): Promise<void> {
    try {
        const { id: _, ...updateFields } = fields;

        await db.update(Prestamos).set(updateFields).where(eq(Prestamos.id, id));
    } catch (e: any) {
        console.error("Error actualizando préstamo:", e);
        if (e.message === "No values to set") {
            throw new BadRequestError("Error, corroborar campos del cuerpo de la petición");
        }
        throw e;
    }
}

/**
 * Eliminar un préstamo
 */
export async function deletePrestamo(id: string): Promise<void> {
    try {
        await db.delete(Prestamos).where(eq(Prestamos.id, id));
    } catch (e) {
        console.error("Error eliminando préstamo:", e);
        throw e;
    }
}

/**
 * Buscar préstamos con filtros dinámicos (similar a selectClientes)
 */
export async function selectPrestamos(
    filters: Partial<SelectPrestamo>
): Promise<SelectPrestamo[]> {
    try {
        const conditions = [];

        if (filters.id) conditions.push(eq(Prestamos.id, filters.id));
        if (filters.clienteId) conditions.push(eq(Prestamos.clienteId, filters.clienteId));
        if (filters.cuentaId) conditions.push(eq(Prestamos.cuentaId, filters.cuentaId));
        if (filters.estado) conditions.push(eq(Prestamos.estado, filters.estado));
        if (filters.montoSolicitado) conditions.push(eq(Prestamos.montoSolicitado, filters.montoSolicitado));
        if (filters.montoAprobado) conditions.push(eq(Prestamos.montoAprobado, filters.montoAprobado));
        if (filters.tasaInteres) conditions.push(eq(Prestamos.tasaInteres, filters.tasaInteres));
        if (filters.plazoMeses) conditions.push(eq(Prestamos.plazoMeses, filters.plazoMeses));
        if (filters.fechaSolicitud) conditions.push(eq(Prestamos.fechaSolicitud, filters.fechaSolicitud));

        if (conditions.length > 0) {
            return await db.select().from(Prestamos).where(and(...conditions));
        } else {
            return await db.select().from(Prestamos);
        }
    } catch (e) {
        console.error("Error obteniendo préstamos en selectPrestamos:", e);
        throw e;
    }
}

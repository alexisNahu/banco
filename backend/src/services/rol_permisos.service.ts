import {eq, sql} from "drizzle-orm";
import { db } from "../db/connection.js";
import {ApiError, handleError, NotFoundError} from "../apiErrores.js";
import {Roles, type SelectRol} from "../db/schema.js";
import type {RolNombreEnum} from "../models/models.js";

export async function getPermisosByRolId(rolId: string): Promise<string[]> {
    const result = await db.execute<{ nombre: string }>(
        sql`
            SELECT prm.nombre
            FROM permisos AS prm
                     INNER JOIN roles_permisos ON prm.id = roles_permisos.permiso_id
                     INNER JOIN roles ON roles_permisos.rol_id = roles.id
            WHERE roles.id = ${rolId}
        `
    );

    if (!result.rows || result.rows.length === 0) {
        throw new NotFoundError("No se encontraron permisos con este rol");
    }

    // Mapea a string[] y retorna
    return result.rows.map(row => row.nombre);
}

export async function getRoleByName(name: RolNombreEnum): Promise<SelectRol> {
    try {
        const [result] = await db.select().from(Roles).where(eq(Roles.nombre,name))

        if (!result) throw new NotFoundError(`No hay error con ese nombre ${name}`)

        return result
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

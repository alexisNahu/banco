import {db} from "../db/connection.js";
import {
    Clientes,
    type InsertUsuarioSistema,
    type SelectCliente,
    type SelectUsuarioSistema,
    Usuarios_Sistema
} from "../db/schema.js";
import {and, eq, sql} from "drizzle-orm";
import {BadRequestError} from "../apiErrores.js";

export async function getApiUsuarioSistemaById(id: string){
    try {
        const [usuario] = await db.select().from(Usuarios_Sistema).where(eq(Usuarios_Sistema.id, id)).limit(1)
        return usuario
    } catch (e) {
        console.error(e); throw e
    }
}

export async function getApiUsuarioSistemaByUsername(username: string) {
    try {
        const [usuario] = await db.select().from(Usuarios_Sistema).where(eq(Usuarios_Sistema.username, username)).limit(1)
        return usuario
    } catch (e) {
        console.error(e); throw e
    }
}

export async function updateUsuarioSistema(fields: Partial<SelectUsuarioSistema>, id: string): Promise<void> {
    try {
        console.log({id, fields})
        const { id: _, ...updateFields } = fields;
        await db.update(Usuarios_Sistema).set(updateFields).where(eq(Usuarios_Sistema.id, id))
    } catch (e: any) {
        console.log('Error actualizando al usuario');
        if (e.message === 'No values to set') throw new BadRequestError('Error, corroborar campos del cuerpo de la petición')
        throw e
    }
}


export async function selectUsuariosSistema(fields: Partial<SelectUsuarioSistema>): Promise<SelectUsuarioSistema[]> {
    try {
        const conditions = [];

        if (fields.id) conditions.push(eq(Usuarios_Sistema.id, `${fields.id}`));
        if (fields.username) conditions.push(eq(Usuarios_Sistema.username, fields.username));

        if (conditions.length > 0) {
            return await db.select().from(Usuarios_Sistema).where(and(...conditions));
        } else {
            return await db.select().from(Usuarios_Sistema);
        }

    } catch (e) {
        console.error('Error obteniendo usuarios en selectUsuariosSistema:', e);
        throw e;
    }
}

export async function existsApiUsername(username: string): Promise<boolean> {
    try {
        const exists = await db.execute(
            sql`SELECT 1 FROM usuarios_sistema WHERE username = ${username} LIMIT 1`
        )

        return exists.rows.length > 0;
    } catch (e) {
        console.error(e); throw e
    }
}

export async function createApiUsuarioSistema(usuario: InsertUsuarioSistema) {
    try {
        const [newUsuario] = await db.insert(Usuarios_Sistema).values(usuario).returning()

        return newUsuario
    } catch (e) {
        console.error(e); throw e
    }
}
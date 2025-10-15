import {db} from "../db/connection.js";
import {Clientes, Cuentas, type InsertCliente, type SelectCliente} from "../db/schema.js";
import { and, eq } from 'drizzle-orm';
import type {ClienteQueryData} from "../models/zod_schemas/clientes.schemas.js";
import {BadRequestError, handleError} from "../apiErrores.js";

export async function selectClienteById(id: string): Promise<SelectCliente | undefined> {
    try {
        const [cliente]: SelectCliente[] = await db.select().from(Clientes).where(eq(Clientes.id, id)).limit(1)
        return cliente
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function selectClienteByEmail(email: string): Promise<SelectCliente | undefined> {
    try {
        const [cliente]: SelectCliente[] = await db.select().from(Clientes).where(eq(Clientes.email, email)).limit(1)
        return cliente
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function selectClienteByNumeroIdentificacion(num: string) {
    try {
        const [cliente] = await db.select().from(Clientes).where(eq(Clientes.numeroIdentificacion, num))
        return cliente
    } catch (e) {
        console.error(e); throw e
    }
}

export async function insertCliente(cliente: InsertCliente): Promise<SelectCliente | undefined> {
    try {
        const [newCliente]: SelectCliente[] = await db.insert(Clientes).values(cliente).returning()
        return newCliente
    } catch (e) {
        console.error(e)
        throw e
    }
}


export async function selectClientes(fields: Partial<SelectCliente>): Promise<SelectCliente[]> {
    try {
        const conditions = [];

        if (fields.id) conditions.push(eq(Clientes.id, `${fields.id}`));
        if (fields.apellidos) conditions.push(eq(Clientes.apellidos, fields.apellidos));
        if (fields.ciudad) conditions.push(eq(Clientes.ciudad, fields.ciudad));
        if (fields.email) conditions.push(eq(Clientes.email, fields.email));
        if (fields.estado) conditions.push(eq(Clientes.estado, fields.estado));
        if (fields.nacionalidad) conditions.push(eq(Clientes.nacionalidad, fields.nacionalidad));
        if (fields.numeroIdentificacion) conditions.push(eq(Clientes.numeroIdentificacion, fields.numeroIdentificacion));
        if (fields.tipoIdentificacion) conditions.push(eq(Clientes.tipoIdentificacion, fields.tipoIdentificacion));
        if (fields.nombres) conditions.push(eq(Clientes.nombres, fields.nombres));

        if (conditions.length > 0) {
            return await db.select().from(Clientes).where(and(...conditions));
        } else {
            return await db.select().from(Clientes);
        }

    } catch (e) {
        console.log('Error obteniendo clientes en getBdClientes');
        throw e;
    }
}

export async function updateCliente(fields: Partial<SelectCliente>, id: string): Promise<void> {
    try {
        const { id: _, ...updateFields } = fields;
        await db.update(Clientes).set(updateFields).where(eq(Clientes.id, id))
    } catch (e: any) {
        console.log('Error actualizando al cliente');
        if (e.message === 'No values to set') throw new BadRequestError('Error, corroborar campos del cuerpo de la petición')
        throw e
    }
}

export async function deleteCliente(id: string): Promise<void> {
    try {
        await db.delete(Clientes).where(eq(Clientes.id, id))
    } catch (e) {
        console.error('Error eliminando el cliente')
        throw e
    }
}

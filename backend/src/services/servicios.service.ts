import {db} from "../db/connection.js";
import {type SelectServicio, Servicios} from "../db/schema.js";
import {eq} from "drizzle-orm";
import {ApiError, handleError, NotFoundError} from "../apiErrores.js";

export async function getServicioByNombre(nombre: string): Promise<SelectServicio> {
    try {
        const [result] = await db.select().from(Servicios).where(eq(Servicios.nombreServicio, nombre))
        if (!result) throw new NotFoundError(`No existe un servicio con el nombre ${nombre}`)
        return result
    } catch (e: any) {
        console.error(e)
        handleError(e as ApiError)
        throw e
    }
}
import { db } from "../db/connection.js";
import { Clientes } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { InternalServerError, NotFoundError } from "../apiErrores.js";
export async function getBdClienteById(id) {
    try {
        const [cliente] = await db.select().from(Clientes).where(eq(Clientes.id, id)).limit(1);
        return cliente;
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}
export async function insertCliente(cliente) {
    try {
        const [newCliente] = await db.insert(Clientes).values(cliente).returning();
        return newCliente;
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}

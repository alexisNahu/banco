import z from "zod";
import { estadoUsuarioEnum } from "../../../backend/src/db/schema";
/* ---------------- READ ---------------- */
export const ReadUsuarioSistemaSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: z.object({
        id: z.string().optional(),
        clienteId: z.string().optional(),
        username: z.string().optional(),
        rolId: z.string().optional(),
        estado: z.enum(estadoUsuarioEnum.enumValues).optional(),
    }),
});
/* ---------------- UPDATE ---------------- */
export const UpdateUsuarioSistemaSchema = z.object({
    params: z.object({ id: z.string() }),
    query: z.object({}).optional(),
    body: z.object({
        clienteId: z.string().optional(),
        username: z.string().min(3).optional(),
        passwordHash: z.string().min(6).optional(),
        rolId: z.string().optional(),
        fechaUltimoAcceso: z.coerce.date().optional(),
        estado: z.enum(estadoUsuarioEnum.enumValues).optional(),
        intentosFallidos: z.number().int().min(0).optional(),
        fechaUltimoCambioPassword: z.coerce.date().optional(),
    }),
});
/* ---------------- DELETE ---------------- */
export const DeleteUsuarioSistemaSchema = z.object({
    body: z.object({}).optional(),
    query: z.object({}).optional(),
    params: z.object({
        id: z.string(),
    }),
});

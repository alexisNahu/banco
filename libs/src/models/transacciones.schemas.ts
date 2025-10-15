import z from "zod";
import {
    tipoTransaccionEnum,
    monedaEnum,
    estadoTransaccionEnum,
} from "../../db/schema.js";

// ✅ Create
export const CreateTransaccionSchema = z.object({
    params: z.object({}).optional(),
    query: z.object({}).optional(),
    body: z.object({
        tipoTransaccion: z.enum(tipoTransaccionEnum.enumValues),
        cuentaOrigenId: z.string().optional(),
        cuentaDestinoId: z.string().optional(),
        cajeroId: z.string().optional(),
        servicioId: z.string().optional(),
        monto: z.string().transform(Number), // numeric en Postgres llega como string
        moneda: z.enum(monedaEnum.enumValues),
        fechaHoraTransaccion: z.coerce.date().optional().default(new Date()),
        descripcion: z.string().optional(),
        codigoAutorizacion: z.string().optional(),
        referenciaPago: z.string().optional(),
    }),
});

// ✅ Read (para filtros de búsqueda)
export const ReadTransaccionSchema = z.object({
    body: z.object().optional(),
    params: z.object().optional(),
    query: z.object({
        id: z.string().optional(),
        tipoTransaccion: z.enum(tipoTransaccionEnum.enumValues).optional(),
        cuentaOrigenId: z.string().optional(),
        cuentaDestinoId: z.string().optional(),
        cajeroId: z.string().optional(),
        servicioId: z.string().optional(),
        moneda: z.enum(monedaEnum.enumValues).optional(),
        estado: z.enum(estadoTransaccionEnum.enumValues).optional(),
        fechaDesde: z.coerce.date().optional(), // filtros por rango
        fechaHasta: z.coerce.date().optional(),
    }),
});

// ✅ Delete
export const DeleteTransaccionSchema = z.object({
    body: z.object().optional(),
    query: z.object().optional(),
    params: z.object({
        id: z.string(),
    }),
});

// ✅ Update
export const UpdateTransaccionSchema = z.object({
    params: z.object({ id: z.string() }),
    query: z.object().optional(),
    body: z.object({
        tipoTransaccion: z.enum(tipoTransaccionEnum.enumValues).optional(),
        cuentaOrigenId: z.string().optional(),
        cuentaDestinoId: z.string().optional(),
        cajeroId: z.string().optional(),
        servicioId: z.string().optional(),
        monto: z.string().optional(),
        moneda: z.enum(monedaEnum.enumValues).optional(),
        fechaHoraTransaccion: z.coerce.date().optional(),
        descripcion: z.string().optional(),
        estado: z.enum(estadoTransaccionEnum.enumValues).optional(),
        codigoAutorizacion: z.string().optional(),
        referenciaPago: z.string().optional(),
    }),
});

// ✅ Tipos derivados
export type TransaccionQueryString = z.input<typeof ReadTransaccionSchema>["query"];
export type TransaccionQueryData = z.output<typeof ReadTransaccionSchema>["query"];

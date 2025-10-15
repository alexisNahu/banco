import z from "zod";
import {
    estadoTarjetaEnum,
    tipoTarjetaEnum,
} from "../../db/schema.js";

// ─── Create ─────────────────────────────────────────────
export const CreateTarjetaSchema = z.object({
    params: z.object({}).optional(),
    query: z.object({}).optional(),
    body: z.object({
        cuentaId: z.string(),
        numeroTarjeta: z.string(),
        tipoTarjeta: z.enum(tipoTarjetaEnum.enumValues),
        fechaEmision: z.coerce.date(),
        fechaVencimiento: z.coerce.date(),
        codigoSeguridad: z.string(),
        limiteCredito: z.string().optional(), // numeric -> string en Drizzle
        limiteDiarioRetiro: z.string().optional(),
        estado: z.enum(estadoTarjetaEnum.enumValues),
    }),
});

// ─── Read ──────────────────────────────────────────────
export const ReadTarjetaSchema = z.object({
    body: z.object().optional(),
    params: z.object().optional(),
    query: z.object({
        id: z.string().optional(),
        cuentaId: z.string().optional(),
        numeroTarjeta: z.string().optional(),
        tipoTarjeta: z.enum(tipoTarjetaEnum.enumValues).optional(),
        estado: z.enum(estadoTarjetaEnum.enumValues).optional(),
    }),
});

// ─── Delete ────────────────────────────────────────────
export const DeleteTarjetaSchema = z.object({
    body: z.object().optional(),
    query: z.object().optional(),
    params: z.object({
        id: z.string(),
    }),
});

// ─── Update ────────────────────────────────────────────
export const UpdateTarjetaSchema = z.object({
    params: z.object({ id: z.string() }),
    query: z.object().optional(),
    body: z.object({
        cuentaId: z.string().optional(),
        numeroTarjeta: z.string().optional(),
        tipoTarjeta: z.enum(tipoTarjetaEnum.enumValues).optional(),
        fechaEmision: z.coerce.date().optional(),
        fechaVencimiento: z.coerce.date().optional(),
        codigoSeguridad: z.string().optional(),
        limiteCredito: z.string().optional(),
        limiteDiarioRetiro: z.string().optional(),
        estado: z.enum(estadoTarjetaEnum.enumValues).optional(),
    }),
});

// ─── Types ─────────────────────────────────────────────
export type TarjetaQueryString = z.input<typeof ReadTarjetaSchema>["query"];
export type TarjetaQueryData = z.output<typeof ReadTarjetaSchema>["query"];

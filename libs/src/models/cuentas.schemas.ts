import z from "zod";
import {
    tipoCuentaEnum,
    monedaEnum,
    estadoCuentaEnum,
} from "../../db/schema.js";

// ─── Create ──────────────────────────────────────────────
export const CreateCuentaSchema = z.object({
    params: z.object({}).optional(),
    query: z.object({}).optional(),
    body: z.object({
        numeroIdentificacion: z.coerce.number(),
        tipoCuenta: z.enum(tipoCuentaEnum.enumValues),
        moneda: z.enum(monedaEnum.enumValues),
        fechaApertura: z.coerce.date().default(new Date()),
        limiteTransferenciaDiaria: z.string().default("5000000"),
        saldoActual: z.coerce.number().optional().default(0),
        saldoDisponible: z.coerce.number().optional().default(0),
        estado: z.enum(estadoCuentaEnum.enumValues).optional().default('activa'),
    }),
});

// ─── Read ────────────────────────────────────────────────
export const ReadCuentaSchema = z.object({
    body: z.object().optional(),
    params: z.object().optional(),
    query: z.object({
        id: z.string().optional(),
        clienteId: z.string().optional(),
        numeroCuenta: z.string().optional(),
        tipoCuenta: z.enum(tipoCuentaEnum.enumValues).optional(),
        moneda: z.enum(monedaEnum.enumValues).optional(),
        estado: z.enum(estadoCuentaEnum.enumValues).optional(),
    }),
});

// ─── Delete ──────────────────────────────────────────────
export const DeleteCuentaSchema = z.object({
    body: z.object().optional(),
    query: z.object().optional(),
    params: z.object({
        id: z.string(),
    }),
});

// ─── Update ──────────────────────────────────────────────
export const UpdateCuentaSchema = z.object({
    params: z.object({ id: z.string() }),
    query: z.object().optional(),
    body: z.object({
        clienteId: z.string().optional(),
        numeroCuenta: z.string().optional(),
        tipoCuenta: z.enum(tipoCuentaEnum.enumValues).optional(),
        saldoActual: z.string().optional(),
        saldoDisponible: z.string().optional(),
        moneda: z.enum(monedaEnum.enumValues).optional(),
        fechaApertura: z.coerce.date().optional(),
        fechaCierre: z.coerce.date().optional(),
        estado: z.enum(estadoCuentaEnum.enumValues).optional(),
        limiteTransferenciaDiaria: z.string().optional(),
    }),
});

// ─── Types ───────────────────────────────────────────────
export type CuentaQueryString = z.input<typeof ReadCuentaSchema>["query"];
export type CuentaQueryData = z.output<typeof ReadCuentaSchema>["query"];
export type CreateCuentaType = z.infer<typeof CreateCuentaSchema>["body"];

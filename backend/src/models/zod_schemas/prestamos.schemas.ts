import z from "zod";
import { estadoPrestamoEnum } from "../../db/schema.js";

// ─── Create ──────────────────────────────────────────────
export const CreatePrestamoSchema = z.object({
    params: z.object({}).optional(),
    query: z.object({}).optional(),
    body: z.object({
        clienteId: z.string(),
        cuentaId: z.string(),
        montoSolicitado: z.coerce.number(),
        montoAprobado: z.coerce.number().optional(),
        tasaInteres: z.coerce.number(),
        plazoMeses: z.coerce.number().int().positive(),
        fechaSolicitud: z.coerce.date().default(new Date()),
        estado: z.enum(estadoPrestamoEnum.enumValues).default('solicitado'),
    }),
});

// ─── Read ────────────────────────────────────────────────
export const ReadPrestamoSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: z.object({
        id: z.string().optional(),
        clienteId: z.string().optional(),
        cuentaId: z.string().optional(),
        estado: z.enum(estadoPrestamoEnum.enumValues).optional(),
        montoSolicitado: z.coerce.number().optional(),
        montoAprobado: z.coerce.number().optional(),
        tasaInteres: z.coerce.number().optional(),
        plazoMeses: z.coerce.number().optional(),
        fechaSolicitud: z.coerce.date().optional(),
        fechaAprobacion: z.coerce.date().optional(),
        fechaVencimiento: z.coerce.date().optional(),
    }),
});

// ─── Delete ──────────────────────────────────────────────
export const DeletePrestamoSchema = z.object({
    body: z.object({}).optional(),
    query: z.object({}).optional(),
    params: z.object({
        id: z.string(),
    }),
});

// ─── Update ──────────────────────────────────────────────
export const UpdatePrestamoSchema = z.object({
    params: z.object({ id: z.string() }),
    query: z.object().optional(),
    body: z.object({
        clienteId: z.string().optional(),
        cuentaId: z.string().optional(),
        montoSolicitado: z.coerce.number().optional(),
        montoAprobado: z.coerce.number().optional(),
        tasaInteres: z.coerce.number().optional(),
        plazoMeses: z.coerce.number().int().positive().optional(),
        cuotaMensual: z.coerce.number().optional(),
        fechaSolicitud: z.coerce.date().optional(),
        fechaAprobacion: z.coerce.date().optional(),
        fechaVencimiento: z.coerce.date().optional(),
        estado: z.enum(estadoPrestamoEnum.enumValues).optional(),
        motivoRechazo: z.string().nullable().optional(),
    }),
});

export const AprobarPrestamoSchema = z.object({
    params: z.object({
        prestamoId: z.string(), // id del préstamo
    }),
});

// Rechazar préstamo
export const RechazarPrestamoSchema = z.object({
    params: z.object({
        prestamoId: z.string(), // id del préstamo
    }),
    body: z.object({
        motivoRechazo: z.string().min(5, "Debe especificar un motivo"), // motivo de rechazo
    }),
});

// Marcar préstamo como moroso
export const MorosoPrestamoSchema = z.object({
    params: z.object({
        prestamoId: z.string(), // id del préstamo
    }),
    body: z.object({
        fechaMorosidad: z.coerce.date().optional(), // fecha de inicio de morosidad (si no se envía, se toma la fecha actual)
        observaciones: z.string().optional(), // notas del banco sobre la morosidad
    }).optional(),
});

// Pagar préstamo
export const PagarPrestamoSchema = z.object({
    params: z.object({
        prestamoId: z.string(), // id del préstamo
    }),
    body: z.object({
        montoPagado: z.coerce.number().min(1, "El monto debe ser mayor que 0"), // monto a pagar
        fechaPago: z.coerce.date().optional(), // si no se envía, el backend usa la fecha actual
    }),
});


// ─── Types ───────────────────────────────────────────────
export type PrestamoQueryString = z.input<typeof ReadPrestamoSchema>["query"];
export type PrestamoQueryData = z.output<typeof ReadPrestamoSchema>["query"];
export type CreatePrestamoType = z.infer<typeof CreatePrestamoSchema>["body"];

export type RechazarPrestamoType = z.infer<typeof RechazarPrestamoSchema>["body"]
export type PagarPrestamoType = z.infer<typeof PagarPrestamoSchema>["body"]
export type MorosoPrestamoType = z.infer<typeof MorosoPrestamoSchema>["body"]

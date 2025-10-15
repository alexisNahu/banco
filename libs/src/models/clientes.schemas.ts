import z from 'zod'
import {
    ciudadEnum,
    departamentoEnum,
    distritoEnum,
    estadoClienteEnum,
    tipoIdentificacionEnum
} from "../../db/schema.js";

export const CreateClienteSchema = z.object({
    params: z.object({}).optional(),
    query: z.object({}).optional(),
    body: z.object({
        tipoIdentificacion: z.enum(tipoIdentificacionEnum.enumValues),
        numeroIdentificacion: z.string(),
        nombres: z.string(),
        apellidos: z.string(),
        fechaNacimiento: z.coerce.date(),
        nacionalidad: z.string(),
        direccion: z.string(),
        departamento: z.enum(departamentoEnum.enumValues),
        distrito: z.enum(distritoEnum.enumValues),
        ciudad: z.enum(ciudadEnum.enumValues),
        telefono: z.string(),
        email: z.email(),
        fechaCreacion: z.coerce.date(),
        fechaActualizacion: z.coerce.date(),
        estado: z.enum(estadoClienteEnum.enumValues)
    })
})

export const ReadClienteSchema = z.object({
    body: z.object().optional(),
    params: z.object().optional(),
    query: z.object({
        id: z.string().optional(),
        tipoIdentificacion: z.enum(tipoIdentificacionEnum.enumValues).optional(),
        numeroIdentificacion: z.string().optional(),
        nombres: z.string().optional(),
        apellidos: z.string().optional(),
        nacionalidad: z.string().optional(),
        ciudad: z.enum(ciudadEnum.enumValues).optional(),
        email: z.email().optional(),
        estado: z.enum(estadoClienteEnum.enumValues).optional()
    })
})

export const DeleteClienteSchema = z.object({
    body: z.object().optional(),
    query: z.object().optional(),
    params: z.object({
        id: z.string()
    })
})

export const UpdateClienteSchema = z.object({
    params: z.object({id: z.string()}),
    query: z.object().optional(),
    body: z.object({
        tipoIdentificacion: z.enum(tipoIdentificacionEnum.enumValues).optional(),
        numeroIdentificacion: z.string().optional(),
        nombres: z.string().optional(),
        apellidos: z.string().optional(),
        fechaNacimiento: z.coerce.date().optional(),
        nacionalidad: z.string().optional(),
        direccion: z.string().optional(),
        departamento: z.enum(departamentoEnum.enumValues).optional(),
        distrito: z.enum(distritoEnum.enumValues).optional(),
        ciudad: z.enum(ciudadEnum.enumValues).optional(),
        telefono: z.string().optional(),
        email: z.email().optional(),
        fechaCreacion: z.coerce.date().optional(),
        fechaActualizacion: z.coerce.date().optional(),
        estado: z.enum(estadoClienteEnum.enumValues).optional()
    }),
})

export type ClienteQueryString = z.input<typeof ReadClienteSchema>['query']
export type ClienteQueryData = z.output<typeof ReadClienteSchema>['query']
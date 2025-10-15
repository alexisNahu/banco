import z from 'zod'
import {rolNombreEnum} from "../../db/schema.js";

export const LoginSchema = z.object({
    params: z.object({}).optional(),
    body: z.object({
        username: z.string(),
        password: z.string()
    }),
    query: z.object({}).optional()
})

export const RegisterSchema = z.object({
    params: z.object({}).optional(),
    body: z.object({
        password: z.string(),
        username: z.string(),
        repeat_password: z.string(),
        rol: z.enum(rolNombreEnum.enumValues),
        numeroIdentificacion: z.string(),
    }).refine((data) => data.repeat_password === data.password, {
        message: "Las contraseñas no coinciden",
        path: ['repeat_password']
    }),
    query: z.object({}).optional()
})

export type LoginSchemaType = z.infer<typeof LoginSchema>['body']
export type RegisterSchemaType = z.infer<typeof RegisterSchema>['body']
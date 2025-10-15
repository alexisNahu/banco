import z from "zod";
export declare const ReadUsuarioSistemaSchema: z.ZodObject<{
    body: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    params: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    query: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        clienteId: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        rolId: z.ZodOptional<z.ZodString>;
        estado: z.ZodOptional<z.ZodEnum<{
            activo: "activo";
            inactivo: "inactivo";
            bloqueado: "bloqueado";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const UpdateUsuarioSistemaSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    body: z.ZodObject<{
        clienteId: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        passwordHash: z.ZodOptional<z.ZodString>;
        rolId: z.ZodOptional<z.ZodString>;
        fechaUltimoAcceso: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        estado: z.ZodOptional<z.ZodEnum<{
            activo: "activo";
            inactivo: "inactivo";
            bloqueado: "bloqueado";
        }>>;
        intentosFallidos: z.ZodOptional<z.ZodNumber>;
        fechaUltimoCambioPassword: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const DeleteUsuarioSistemaSchema: z.ZodObject<{
    body: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    query: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UsuarioSistemaUpdateType = z.input<typeof UpdateUsuarioSistemaSchema>["body"];
export type UsuarioSistemaReadType = z.output<typeof DeleteUsuarioSistemaSchema>["query"];
//# sourceMappingURL=usuarios_sistema.schemas.d.ts.map
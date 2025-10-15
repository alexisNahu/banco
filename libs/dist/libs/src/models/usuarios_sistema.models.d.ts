import z from "zod";
export declare const ReadUsuarioSistemaSchema: z.ZodObject<{
    body: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
    params: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
    query: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        clienteId: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        rolId: z.ZodOptional<z.ZodString>;
        estado: z.ZodOptional<z.ZodEnum<["activo", "inactivo", "bloqueado"]>>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        estado?: "activo" | "inactivo" | "bloqueado" | undefined;
        clienteId?: string | undefined;
        rolId?: string | undefined;
        username?: string | undefined;
    }, {
        id?: string | undefined;
        estado?: "activo" | "inactivo" | "bloqueado" | undefined;
        clienteId?: string | undefined;
        rolId?: string | undefined;
        username?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        id?: string | undefined;
        estado?: "activo" | "inactivo" | "bloqueado" | undefined;
        clienteId?: string | undefined;
        rolId?: string | undefined;
        username?: string | undefined;
    };
    params?: {} | undefined;
    body?: {} | undefined;
}, {
    query: {
        id?: string | undefined;
        estado?: "activo" | "inactivo" | "bloqueado" | undefined;
        clienteId?: string | undefined;
        rolId?: string | undefined;
        username?: string | undefined;
    };
    params?: {} | undefined;
    body?: {} | undefined;
}>;
export declare const UpdateUsuarioSistemaSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    query: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
    body: z.ZodObject<{
        clienteId: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        passwordHash: z.ZodOptional<z.ZodString>;
        rolId: z.ZodOptional<z.ZodString>;
        fechaUltimoAcceso: z.ZodOptional<z.ZodDate>;
        estado: z.ZodOptional<z.ZodEnum<["activo", "inactivo", "bloqueado"]>>;
        intentosFallidos: z.ZodOptional<z.ZodNumber>;
        fechaUltimoCambioPassword: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        estado?: "activo" | "inactivo" | "bloqueado" | undefined;
        clienteId?: string | undefined;
        rolId?: string | undefined;
        username?: string | undefined;
        passwordHash?: string | undefined;
        fechaUltimoAcceso?: Date | undefined;
        intentosFallidos?: number | undefined;
        fechaUltimoCambioPassword?: Date | undefined;
    }, {
        estado?: "activo" | "inactivo" | "bloqueado" | undefined;
        clienteId?: string | undefined;
        rolId?: string | undefined;
        username?: string | undefined;
        passwordHash?: string | undefined;
        fechaUltimoAcceso?: Date | undefined;
        intentosFallidos?: number | undefined;
        fechaUltimoCambioPassword?: Date | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        estado?: "activo" | "inactivo" | "bloqueado" | undefined;
        clienteId?: string | undefined;
        rolId?: string | undefined;
        username?: string | undefined;
        passwordHash?: string | undefined;
        fechaUltimoAcceso?: Date | undefined;
        intentosFallidos?: number | undefined;
        fechaUltimoCambioPassword?: Date | undefined;
    };
    query?: {} | undefined;
}, {
    params: {
        id: string;
    };
    body: {
        estado?: "activo" | "inactivo" | "bloqueado" | undefined;
        clienteId?: string | undefined;
        rolId?: string | undefined;
        username?: string | undefined;
        passwordHash?: string | undefined;
        fechaUltimoAcceso?: Date | undefined;
        intentosFallidos?: number | undefined;
        fechaUltimoCambioPassword?: Date | undefined;
    };
    query?: {} | undefined;
}>;
export declare const DeleteUsuarioSistemaSchema: z.ZodObject<{
    body: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
    query: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    query?: {} | undefined;
    body?: {} | undefined;
}, {
    params: {
        id: string;
    };
    query?: {} | undefined;
    body?: {} | undefined;
}>;
export type UsuarioSistemaUpdateType = z.input<typeof UpdateUsuarioSistemaSchema>["body"];
export type UsuarioSistemaReadType = z.output<typeof DeleteUsuarioSistemaSchema>["query"];
//# sourceMappingURL=usuarios_sistema.models.d.ts.map
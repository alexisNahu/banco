import z from 'zod';
export declare const LoginSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
}, z.core.$strip>;
export declare const RegisterSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    body: z.ZodObject<{
        password: z.ZodString;
        username: z.ZodString;
        repeat_password: z.ZodString;
        rol: z.ZodEnum<{
            administrador: "administrador";
            cajero: "cajero";
            ejecutivo_cuentas: "ejecutivo_cuentas";
            auditor: "auditor";
            cliente: "cliente";
        }>;
        numeroIdentificacion: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
}, z.core.$strip>;
export type LoginSchemaType = z.infer<typeof LoginSchema>['body'];
export type RegisterSchemaType = z.infer<typeof RegisterSchema>['body'];
//# sourceMappingURL=auth.schemas.d.ts.map
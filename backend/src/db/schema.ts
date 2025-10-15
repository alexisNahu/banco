// src/db/schema.ts
import { pgTable, uuid, serial, text, timestamp, integer, jsonb, pgEnum, numeric, boolean } from "drizzle-orm/pg-core";
import {type InferInsertModel, type InferSelectModel, relations, sql} from "drizzle-orm";

// ================== ENUMS ==================
export const tipoIdentificacionEnum = pgEnum("tipo_identificacion", ["cedula", "ruc", "pasaporte"]);
export const departamentoEnum = pgEnum("departamento", ["Concepcion", "San Pedro", "Asuncion", "Central", "Paraguari", "Itapua", "Misiones", "Caaguazu", "Caazapa", "Alto Parana", "Cordillera", "Guaira", "Canindeyu", "Neembucu", "Amambay", "Presidente Hayes", "Boqueron", "Ñeembucu"]);
export const distritoEnum = pgEnum("distrito", ["Asuncion(Capital)", "Concepcion", "San Pedro", "Ciudad del Este"]);
export const ciudadEnum = pgEnum("ciudad", ["Asuncion", "CDE", "Encarnacion", "Concepcion"]);
export const estadoClienteEnum = pgEnum("estado_cliente", ["activo", "inactivo", "pendiente_verificacion"]);
export const tipoCuentaEnum = pgEnum("tipo_cuenta", ["caja_ahorro", "cuenta_corriente", "plazo_fijo"]);
export const monedaEnum = pgEnum("moneda", ["PYG", "USD"]);
export const estadoCuentaEnum = pgEnum("estado_cuenta", ["activa", "inactiva", "bloqueada", "cerrada"]);
export const tipoTarjetaEnum = pgEnum("tipo_tarjeta", ["debito", "credito"]);
export const estadoTarjetaEnum = pgEnum("estado_tarjeta", ["activa", "bloqueada", "vencida", "reportada"]);
export const estadoCajeroEnum = pgEnum("estado_cajero", ["operativo", "mantenimiento", "fuera_servicio"]);
export const tipoServicioEnum = pgEnum("tipo_servicio", ["luz", "agua", "telefonia", "impuestos"]);
export const estadoServicioEnum = pgEnum("estado_servicio", ["activo", "inactivo"]);
export const tipoTransaccionEnum = pgEnum("tipo_transaccion", ["retiro", "deposito", "transferencia", "pago_servicio", "consulta"]);
export const estadoTransaccionEnum = pgEnum("estado_transaccion", ["completada", "pendiente", "rechazada", "reversada"]);
export const estadoPrestamoEnum = pgEnum("estado_prestamo", ["solicitado", "aprobado", "rechazado", "pagado", "moroso"]);
export const estadoUsuarioEnum = pgEnum("estado_usuario", ["activo", "inactivo", "bloqueado"]);
export const rolNombreEnum = pgEnum("rol_nombre", ["administrador", "cajero", "ejecutivo_cuentas", "auditor", "cliente"]);
export const criticidadEnum = pgEnum("nivel_criticidad", ["bajo", "medio", "alto", "critico"]);
export const logNivelEnum = pgEnum("log_nivel", ["info", "advertencia", "error", "critico"]);

// ================== TABLAS ==================

// Clientes
export const Clientes = pgTable("clientes", {
    id: uuid("id").primaryKey().defaultRandom(),
    tipoIdentificacion: tipoIdentificacionEnum("tipo_identificacion").notNull(),
    numeroIdentificacion: text("numero_identificacion").notNull(),
    nombres: text("nombres").notNull(),
    apellidos: text("apellidos").notNull(),
    fechaNacimiento: timestamp("fecha_nacimiento").notNull(),
    nacionalidad: text("nacionalidad").notNull().default("paraguaya"),
    direccion: text("direccion").notNull(),
    departamento: departamentoEnum("departamento").notNull(),
    distrito: distritoEnum("distrito").notNull(),
    ciudad: ciudadEnum("ciudad").notNull(),
    telefono: text("telefono"),
    email: text("email"),
    fechaCreacion: timestamp("fecha_creacion").defaultNow(),
    fechaActualizacion: timestamp("fecha_actualizacion").defaultNow(),
    estado: estadoClienteEnum("estado").notNull().default("activo"),
});

// Cuentas
export const Cuentas = pgTable("cuentas", {
    id: uuid("id").primaryKey().defaultRandom(),
    clienteId: uuid("cliente_id").notNull().references(() => Clientes.id),
    numeroCuenta: text("numero_cuenta").notNull().default(sql`nextval('numero_cuenta_seq')::text`),
    tipoCuenta: tipoCuentaEnum("tipo_cuenta").notNull(),
    saldoActual: numeric("saldo_actual").notNull(),
    saldoDisponible: numeric("saldo_disponible").notNull(),
    moneda: monedaEnum("moneda").notNull(),
    fechaApertura: timestamp("fecha_apertura").notNull(),
    fechaCierre: timestamp("fecha_cierre"),
    estado: estadoCuentaEnum("estado").notNull(),
    limiteTransferenciaDiaria: numeric("limite_transferencia_diaria").notNull(),
});

// Tarjetas
export const Tarjetas = pgTable("tarjetas", {
    id: uuid("id").primaryKey().defaultRandom(),
    cuentaId: uuid("cuenta_id").notNull().references(() => Cuentas.id),
    numeroTarjeta: text("numero_tarjeta").notNull(),
    tipoTarjeta: tipoTarjetaEnum("tipo_tarjeta").notNull(),
    fechaEmision: timestamp("fecha_emision").notNull(),
    fechaVencimiento: timestamp("fecha_vencimiento").notNull(),
    codigoSeguridad: text("codigo_seguridad").notNull(),
    limiteCredito: numeric("limite_credito"),
    limiteDiarioRetiro: numeric("limite_diario_retiro"),
    estado: estadoTarjetaEnum("estado").notNull(),
});

// Cajeros_Automaticos
export const Cajeros_Automaticos = pgTable("cajeros_automaticos", {
    id: uuid("id").primaryKey().defaultRandom(),
    codigoCajero: text("codigo_cajero").notNull(),
    ubicacion: text("ubicacion").notNull(),
    saldoEfectivoDisponible: numeric("saldo_efectivo_disponible").notNull(),
    denominacionesDisponibles: jsonb("denominaciones_disponibles").notNull(),
    estado: estadoCajeroEnum("estado").notNull(),
    fechaUltimoAbastecimiento: timestamp("fecha_ultimo_abastecimiento"),
    fechaUltimoMantenimiento: timestamp("fecha_ultimo_mantenimiento"),
});

// Servicios
export const Servicios = pgTable("servicios", {
    id: uuid("id").primaryKey().defaultRandom(),
    nombreServicio: text("nombre_servicio").notNull(),
    codigoServicio: text("codigo_servicio").notNull(),
    tipoServicio: tipoServicioEnum("tipo_servicio").notNull(),
    estado: estadoServicioEnum("estado").notNull(),
});

// Transacciones
export const Transacciones = pgTable("transacciones", {
    id: uuid("id").primaryKey().defaultRandom(),
    tipoTransaccion: tipoTransaccionEnum("tipo_transaccion").notNull(),
    cuentaOrigenId: uuid("cuenta_origen_id").references(() => Cuentas.id),
    cuentaDestinoId: uuid("cuenta_destino_id").references(() => Cuentas.id),
    cajeroId: uuid("cajero_id").references(() => Cajeros_Automaticos.id),
    servicioId: uuid("servicio_id").references(() => Servicios.id),
    monto: numeric("monto").notNull(),
    moneda: monedaEnum("moneda").notNull(),
    fechaHoraTransaccion: timestamp("fecha_hora_transaccion").defaultNow(),
    descripcion: text("descripcion"),
    estado: estadoTransaccionEnum("estado").notNull(),
    codigoAutorizacion: text("codigo_autorizacion"),
    referenciaPago: text("referencia_pago"),
});

// Prestamos
export const Prestamos = pgTable("prestamos", {
    id: uuid("id").primaryKey().defaultRandom(),
    clienteId: uuid("cliente_id").notNull().references(() => Clientes.id),
    cuentaId: uuid("cuenta_id").notNull().references(() => Cuentas.id),
    montoSolicitado: numeric("monto_solicitado").notNull(),
    montoAprobado: numeric("monto_aprobado"),
    tasaInteres: numeric("tasa_interes").notNull(),
    plazoMeses: integer("plazo_meses").notNull(),
    cuotaMensual: numeric("cuota_mensual").notNull(),
    fechaSolicitud: timestamp("fecha_solicitud").defaultNow(),
    fechaAprobacion: timestamp("fecha_aprobacion"),
    fechaVencimiento: timestamp("fecha_vencimiento"),
    estado: estadoPrestamoEnum("estado").notNull(),
    motivoRechazo: text("motivo_rechazo"),
    permitir_modifcacion: boolean().default(true),
});

// ================== Usuarios y Roles ==================
export const Roles = pgTable("roles", {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: rolNombreEnum("nombre").notNull(),
    descripcion: text("descripcion"),
});

export const Permisos = pgTable("permisos", {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre").notNull(),
    descripcion: text("descripcion"),
});

export const Roles_Permisos = pgTable("roles_permisos", {
    id: uuid("id").primaryKey().defaultRandom(),
    rolId: uuid("rol_id").notNull().references(() => Roles.id),
    permisoId: uuid("permiso_id").notNull().references(() => Permisos.id),
});

export const Usuarios_Sistema = pgTable("usuarios_sistema", {
    id: uuid("id").primaryKey().defaultRandom(),
    clienteId: uuid("cliente_id").references(() => Clientes.id),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
    rolId: uuid("rol_id").notNull().references(() => Roles.id),
    fechaCreacion: timestamp("fecha_creacion").defaultNow(),
    fechaUltimoAcceso: timestamp("fecha_ultimo_acceso"),
    estado: estadoUsuarioEnum("estado").notNull(),
    intentosFallidos: integer("intentos_fallidos").default(0),
    fechaUltimoCambioPassword: timestamp("fecha_ultimo_cambio_password"),
});

// Auditoria
export const Auditoria = pgTable("auditoria", {
    id: uuid("id").primaryKey().defaultRandom(),
    usuarioId: uuid("usuario_id").notNull().references(() => Usuarios_Sistema.id),
    accionRealizada: text("accion_realizada").notNull(),
    tablaAfectada: text("tabla_afectada").notNull(),
    registroAfectadoId: uuid("registro_afectado_id").notNull(),
    valoresAnteriores: jsonb("valores_anteriores"),
    valoresNuevos: jsonb("valores_nuevos"),
    fechaHora: timestamp("fecha_hora").defaultNow(),
    ipOrigen: text("ip_origen"),
    dispositivo: text("dispositivo"),
    nivelCriticidad: criticidadEnum("nivel_criticidad").notNull().default("bajo"),
});

// Bitacora_Sistema
export const Bitacora_Sistema = pgTable("bitacora_sistema", {
    id: serial("id").primaryKey(),
    fechaHora: timestamp("fecha_hora").defaultNow(),
    nivel: logNivelEnum("nivel").notNull(),
    modulo: text("modulo").notNull(),
    mensaje: text("mensaje").notNull(),
    usuarioId: uuid("usuario_id").references(() => Usuarios_Sistema.id),
    ipOrigen: text("ip_origen"),
    stackTrace: text("stack_trace"),
});

// ================== Relaciones ==================

// Clientes → Cuentas
export const clientesRelations = relations(Clientes, ({ many }) => ({
    cuentas: many(Cuentas),
    prestamos: many(Prestamos),
    usuarios: many(Usuarios_Sistema),
}));

// Cuentas → Tarjetas, Transacciones
export const cuentasRelations = relations(Cuentas, ({ many, one }) => ({
    cliente: one(Clientes, { fields: [Cuentas.clienteId], references: [Clientes.id] }),
    tarjetas: many(Tarjetas),
    transaccionesOrigen: many(Transacciones),
    transaccionesDestino: many(Transacciones),
    prestamos: many(Prestamos),
}));

// Tarjetas → Cuentas
export const tarjetasRelations = relations(Tarjetas, ({ one }) => ({
    cuenta: one(Cuentas, { fields: [Tarjetas.cuentaId], references: [Cuentas.id] }),
}));

// Transacciones → Cuentas, Cajero, Servicio
export const transaccionesRelations = relations(Transacciones, ({ one }) => ({
    cuentaOrigen: one(Cuentas, { fields: [Transacciones.cuentaOrigenId], references: [Cuentas.id] }),
    cuentaDestino: one(Cuentas, { fields: [Transacciones.cuentaDestinoId], references: [Cuentas.id] }),
    cajero: one(Cajeros_Automaticos, { fields: [Transacciones.cajeroId], references: [Cajeros_Automaticos.id] }),
    servicio: one(Servicios, { fields: [Transacciones.servicioId], references: [Servicios.id] }),
}));

// Prestamos → Clientes, Cuentas
export const prestamosRelations = relations(Prestamos, ({ one }) => ({
    cliente: one(Clientes, { fields: [Prestamos.clienteId], references: [Clientes.id] }),
    cuenta: one(Cuentas, { fields: [Prestamos.cuentaId], references: [Cuentas.id] }),
}));

// Usuarios_Sistema → Roles
export const usuariosRelations = relations(Usuarios_Sistema, ({ one }) => ({
    rol: one(Roles, { fields: [Usuarios_Sistema.rolId], references: [Roles.id] }),
    cliente: one(Clientes, { fields: [Usuarios_Sistema.clienteId], references: [Clientes.id] }),
}));

// Roles → Roles_Permisos
export const rolesRelations = relations(Roles, ({ many }) => ({
    permisos: many(Roles_Permisos),
}));

export const rolesPermisosRelations = relations(Roles_Permisos, ({ one }) => ({
    rol: one(Roles, { fields: [Roles_Permisos.rolId], references: [Roles.id] }),
    permiso: one(Permisos, { fields: [Roles_Permisos.permisoId], references: [Permisos.id] }),
}));

// Auditoria → Usuario
export const auditoriaRelations = relations(Auditoria, ({ one }) => ({
    usuario: one(Usuarios_Sistema, { fields: [Auditoria.usuarioId], references: [Usuarios_Sistema.id] }),
}));

// Bitacora → Usuario
export const bitacoraRelations = relations(Bitacora_Sistema, ({ one }) => ({
    usuario: one(Usuarios_Sistema, { fields: [Bitacora_Sistema.usuarioId], references: [Usuarios_Sistema.id] }),
}));

// Exportacion de tipos

// ================== EXPORTAR TIPOS ==================

// Clientes
export type SelectCliente = InferSelectModel<typeof Clientes>;
export type InsertCliente = InferInsertModel<typeof Clientes>;

// Cuentas
export type SelectCuenta = InferSelectModel<typeof Cuentas>;
export type InsertCuenta = InferInsertModel<typeof Cuentas>;

// Tarjetas
export type SelectTarjeta = InferSelectModel<typeof Tarjetas>;
export type InsertTarjeta = InferInsertModel<typeof Tarjetas>;

// Cajeros Automáticos
export type SelectCajero = InferSelectModel<typeof Cajeros_Automaticos>;
export type InsertCajero = InferInsertModel<typeof Cajeros_Automaticos>;

// Servicios
export type SelectServicio = InferSelectModel<typeof Servicios>;
export type InsertServicio = InferInsertModel<typeof Servicios>;

// Transacciones
export type SelectTransaccion = InferSelectModel<typeof Transacciones>;
export type InsertTransaccion = InferInsertModel<typeof Transacciones>;

// Préstamos
export type SelectPrestamo = InferSelectModel<typeof Prestamos>;
export type InsertPrestamo = InferInsertModel<typeof Prestamos>;

// Roles
export type SelectRol = InferSelectModel<typeof Roles>;
export type InsertRol = InferInsertModel<typeof Roles>;

// Permisos
export type SelectPermiso = InferSelectModel<typeof Permisos>;
export type InsertPermiso = InferInsertModel<typeof Permisos>;

// Roles_Permisos
export type SelectRolPermiso = InferSelectModel<typeof Roles_Permisos>;
export type InsertRolPermiso = InferInsertModel<typeof Roles_Permisos>;

// Usuarios del Sistema
export type SelectUsuarioSistema = InferSelectModel<typeof Usuarios_Sistema>;
export type InsertUsuarioSistema = InferInsertModel<typeof Usuarios_Sistema>;

// Auditoría
export type SelectAuditoria = InferSelectModel<typeof Auditoria>;
export type InsertAuditoria = InferInsertModel<typeof Auditoria>;

// Bitácora del Sistema
export type SelectBitacora = InferSelectModel<typeof Bitacora_Sistema>;
export type InsertBitacora = InferInsertModel<typeof Bitacora_Sistema>;



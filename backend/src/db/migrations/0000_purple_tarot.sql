CREATE TYPE "public"."ciudad" AS ENUM('Asuncion', 'CDE', 'Encarnacion', 'Concepcion');--> statement-breakpoint
CREATE TYPE "public"."nivel_criticidad" AS ENUM('bajo', 'medio', 'alto', 'critico');--> statement-breakpoint
CREATE TYPE "public"."departamento" AS ENUM('Concepcion', 'San Pedro', 'Asuncion', 'Central', 'Paraguari', 'Itapua', 'Misiones', 'Caaguazu', 'Caazapa', 'Alto Parana', 'Cordillera', 'Guaira', 'Canindeyu', 'Neembucu', 'Amambay', 'Presidente Hayes', 'Boqueron', 'Ñeembucu');--> statement-breakpoint
CREATE TYPE "public"."distrito" AS ENUM('Asuncion(Capital)', 'Concepcion', 'San Pedro', 'Ciudad del Este');--> statement-breakpoint
CREATE TYPE "public"."estado_cajero" AS ENUM('operativo', 'mantenimiento', 'fuera_servicio');--> statement-breakpoint
CREATE TYPE "public"."estado_cliente" AS ENUM('activo', 'inactivo', 'pendiente_verificacion');--> statement-breakpoint
CREATE TYPE "public"."estado_cuenta" AS ENUM('activa', 'inactiva', 'bloqueada', 'cerrada');--> statement-breakpoint
CREATE TYPE "public"."estado_prestamo" AS ENUM('solicitado', 'aprobado', 'rechazado', 'pagado', 'moroso');--> statement-breakpoint
CREATE TYPE "public"."estado_servicio" AS ENUM('activo', 'inactivo');--> statement-breakpoint
CREATE TYPE "public"."estado_tarjeta" AS ENUM('activa', 'bloqueada', 'vencida', 'reportada');--> statement-breakpoint
CREATE TYPE "public"."estado_transaccion" AS ENUM('completada', 'pendiente', 'rechazada', 'reversada');--> statement-breakpoint
CREATE TYPE "public"."estado_usuario" AS ENUM('activo', 'inactivo', 'bloqueado');--> statement-breakpoint
CREATE TYPE "public"."log_nivel" AS ENUM('info', 'advertencia', 'error', 'critico');--> statement-breakpoint
CREATE TYPE "public"."moneda" AS ENUM('PYG', 'USD');--> statement-breakpoint
CREATE TYPE "public"."rol_nombre" AS ENUM('administrador', 'cajero', 'ejecutivo_cuentas', 'auditor', 'cliente');--> statement-breakpoint
CREATE TYPE "public"."tipo_cuenta" AS ENUM('caja_ahorro', 'cuenta_corriente', 'plazo_fijo');--> statement-breakpoint
CREATE TYPE "public"."tipo_identificacion" AS ENUM('cedula', 'ruc', 'pasaporte');--> statement-breakpoint
CREATE TYPE "public"."tipo_servicio" AS ENUM('luz', 'agua', 'telefonia', 'impuestos');--> statement-breakpoint
CREATE TYPE "public"."tipo_tarjeta" AS ENUM('debito', 'credito');--> statement-breakpoint
CREATE TYPE "public"."tipo_transaccion" AS ENUM('retiro', 'deposito', 'transferencia', 'pago_servicio', 'consulta');--> statement-breakpoint
CREATE TABLE "auditoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"accion_realizada" text NOT NULL,
	"tabla_afectada" text NOT NULL,
	"registro_afectado_id" uuid NOT NULL,
	"valores_anteriores" jsonb,
	"valores_nuevos" jsonb,
	"fecha_hora" timestamp DEFAULT now(),
	"ip_origen" text,
	"dispositivo" text,
	"nivel_criticidad" "nivel_criticidad" DEFAULT 'bajo' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bitacora_sistema" (
	"id" serial PRIMARY KEY NOT NULL,
	"fecha_hora" timestamp DEFAULT now(),
	"nivel" "log_nivel" NOT NULL,
	"modulo" text NOT NULL,
	"mensaje" text NOT NULL,
	"usuario_id" uuid,
	"ip_origen" text,
	"stack_trace" text
);
--> statement-breakpoint
CREATE TABLE "cajeros_automaticos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"codigo_cajero" text NOT NULL,
	"ubicacion" text NOT NULL,
	"saldo_efectivo_disponible" numeric NOT NULL,
	"denominaciones_disponibles" jsonb NOT NULL,
	"estado" "estado_cajero" NOT NULL,
	"fecha_ultimo_abastecimiento" timestamp,
	"fecha_ultimo_mantenimiento" timestamp
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo_identificacion" "tipo_identificacion" NOT NULL,
	"numero_identificacion" text NOT NULL,
	"nombres" text NOT NULL,
	"apellidos" text NOT NULL,
	"fecha_nacimiento" timestamp NOT NULL,
	"nacionalidad" text DEFAULT 'paraguaya' NOT NULL,
	"direccion" text NOT NULL,
	"departamento" "departamento" NOT NULL,
	"distrito" "distrito" NOT NULL,
	"ciudad" "ciudad" NOT NULL,
	"telefono" text,
	"email" text,
	"fecha_creacion" timestamp DEFAULT now(),
	"fecha_actualizacion" timestamp DEFAULT now(),
	"estado" "estado_cliente" DEFAULT 'activo' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cuentas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"numero_cuenta" text NOT NULL,
	"tipo_cuenta" "tipo_cuenta" NOT NULL,
	"saldo_actual" numeric NOT NULL,
	"saldo_disponible" numeric NOT NULL,
	"moneda" "moneda" NOT NULL,
	"fecha_apertura" timestamp NOT NULL,
	"fecha_cierre" timestamp,
	"estado" "estado_cuenta" NOT NULL,
	"limite_transferencia_diaria" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permisos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text
);
--> statement-breakpoint
CREATE TABLE "prestamos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"cuenta_id" uuid NOT NULL,
	"monto_solicitado" numeric NOT NULL,
	"monto_aprobado" numeric,
	"tasa_interes" numeric NOT NULL,
	"plazo_meses" integer NOT NULL,
	"cuota_mensual" numeric NOT NULL,
	"fecha_solicitud" timestamp DEFAULT now(),
	"fecha_aprobacion" timestamp,
	"fecha_vencimiento" timestamp NOT NULL,
	"estado" "estado_prestamo" NOT NULL,
	"motivo_rechazo" text
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" "rol_nombre" NOT NULL,
	"descripcion" text
);
--> statement-breakpoint
CREATE TABLE "roles_permisos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rol_id" uuid NOT NULL,
	"permiso_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servicios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre_servicio" text NOT NULL,
	"codigo_servicio" text NOT NULL,
	"tipo_servicio" "tipo_servicio" NOT NULL,
	"estado" "estado_servicio" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tarjetas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cuenta_id" uuid NOT NULL,
	"numero_tarjeta" text NOT NULL,
	"tipo_tarjeta" "tipo_tarjeta" NOT NULL,
	"fecha_emision" timestamp NOT NULL,
	"fecha_vencimiento" timestamp NOT NULL,
	"codigo_seguridad" text NOT NULL,
	"limite_credito" numeric,
	"limite_diario_retiro" numeric,
	"estado" "estado_tarjeta" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transacciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo_transaccion" "tipo_transaccion" NOT NULL,
	"cuenta_origen_id" uuid NOT NULL,
	"cuenta_destino_id" uuid,
	"cajero_id" uuid,
	"servicio_id" uuid,
	"monto" numeric NOT NULL,
	"moneda" "moneda" NOT NULL,
	"fecha_hora_transaccion" timestamp DEFAULT now(),
	"descripcion" text,
	"estado" "estado_transaccion" NOT NULL,
	"codigo_autorizacion" text,
	"referencia_pago" text
);
--> statement-breakpoint
CREATE TABLE "usuarios_sistema" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"rol_id" uuid NOT NULL,
	"fecha_creacion" timestamp DEFAULT now(),
	"fecha_ultimo_acceso" timestamp,
	"estado" "estado_usuario" NOT NULL,
	"intentos_fallidos" integer DEFAULT 0,
	"fecha_ultimo_cambio_password" timestamp
);
--> statement-breakpoint
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_usuarios_sistema_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios_sistema"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bitacora_sistema" ADD CONSTRAINT "bitacora_sistema_usuario_id_usuarios_sistema_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios_sistema"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas" ADD CONSTRAINT "cuentas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestamos" ADD CONSTRAINT "prestamos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestamos" ADD CONSTRAINT "prestamos_cuenta_id_cuentas_id_fk" FOREIGN KEY ("cuenta_id") REFERENCES "public"."cuentas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_permisos" ADD CONSTRAINT "roles_permisos_rol_id_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_permisos" ADD CONSTRAINT "roles_permisos_permiso_id_permisos_id_fk" FOREIGN KEY ("permiso_id") REFERENCES "public"."permisos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarjetas" ADD CONSTRAINT "tarjetas_cuenta_id_cuentas_id_fk" FOREIGN KEY ("cuenta_id") REFERENCES "public"."cuentas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_cuenta_origen_id_cuentas_id_fk" FOREIGN KEY ("cuenta_origen_id") REFERENCES "public"."cuentas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_cuenta_destino_id_cuentas_id_fk" FOREIGN KEY ("cuenta_destino_id") REFERENCES "public"."cuentas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_cajero_id_cajeros_automaticos_id_fk" FOREIGN KEY ("cajero_id") REFERENCES "public"."cajeros_automaticos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_servicio_id_servicios_id_fk" FOREIGN KEY ("servicio_id") REFERENCES "public"."servicios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_rol_id_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
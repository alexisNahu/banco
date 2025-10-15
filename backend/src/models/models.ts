// ✅ Tipos TypeScript generados a partir de tus pgEnum

import {tipoIdentificacionEnum, tipoTarjetaEnum, departamentoEnum,
distritoEnum, ciudadEnum, estadoTarjetaEnum, tipoTransaccionEnum,
 tipoServicioEnum, tipoCuentaEnum, estadoClienteEnum, estadoUsuarioEnum,
    estadoCuentaEnum, estadoCajeroEnum, estadoTransaccionEnum, estadoPrestamoEnum,
    estadoServicioEnum, criticidadEnum, rolNombreEnum, monedaEnum, logNivelEnum} from "../db/schema.js";

export type TipoIdentificacion = (typeof tipoIdentificacionEnum.enumValues)[number];
export type Departamento = (typeof departamentoEnum.enumValues)[number];
export type Distrito = (typeof distritoEnum.enumValues)[number];
export type Ciudad = (typeof ciudadEnum.enumValues)[number];
export type EstadoCliente = (typeof estadoClienteEnum.enumValues)[number];
export type TipoCuenta = (typeof tipoCuentaEnum.enumValues)[number];
export type Moneda = (typeof monedaEnum.enumValues)[number];
export type EstadoCuenta = (typeof estadoCuentaEnum.enumValues)[number];

export type TipoTarjeta = (typeof tipoTarjetaEnum.enumValues)[number];
export type EstadoTarjeta = (typeof estadoTarjetaEnum.enumValues)[number];
export type EstadoCajero = (typeof estadoCajeroEnum.enumValues)[number];
export type TipoServicio = (typeof tipoServicioEnum.enumValues)[number];
export type EstadoServicio = (typeof estadoServicioEnum.enumValues)[number];
export type TipoTransaccion = (typeof tipoTransaccionEnum.enumValues)[number];
export type EstadoTransaccion = (typeof estadoTransaccionEnum.enumValues)[number];
export type EstadoPrestamo = (typeof estadoPrestamoEnum.enumValues)[number];
export type EstadoUsuario = (typeof estadoUsuarioEnum.enumValues)[number];
export type RolNombre = (typeof rolNombreEnum.enumValues)[number];
export type Criticidad = (typeof criticidadEnum.enumValues)[number];
export type LogNivel = (typeof logNivelEnum.enumValues)[number];

export const MONEDAS_CONVERSIONES = {
    USD_PYG: 7029.55,
    PYG_USD: 0.00014,
}



export const LIMITES_PENDIENTE = {
    caja_ahorro: {
        PYG: 10000000, // 10 millones PYG
        USD: 5000      // 5,000 USD
    },
    cuenta_corriente: {
        PYG: 20000000, // 20 millones PYG
        USD: 10000     // 10,000 USD
    },
    plazo_fijo: {
        PYG: 0,        // No permitir transferencias
        USD: 0
    }
};

export enum Permiso {
    CREATE_TRANSACCION = "CREATE_TRANSACCION",
    CREATE_PRESTAMO = "CREATE_PRESTAMO",
    CREATE_DEPOSITO = "CREATE_DEPOSITO",
    CREATE_EXTRACCION = "CREATE_EXTRACCION",
    LIST_CLIENTES = "LIST_CLIENTES",
}

export enum TipoIdentificacionEnum {
    CEDULA = "cedula",
    RUC = "ruc",
    PASAPORTE = "pasaporte",
}

export enum DepartamentoEnum {
    CONCEPCION = "Concepcion",
    SAN_PEDRO = "San Pedro",
    ASUNCION = "Asuncion",
    CENTRAL = "Central",
    PARAGUARI = "Paraguari",
    ITAPUA = "Itapua",
    MISIONES = "Misiones",
    CAAGUAZU = "Caaguazu",
    CAAZAPA = "Caazapa",
    ALTO_PARANA = "Alto Parana",
    CORDILLERA = "Cordillera",
    GUAIRA = "Guaira",
    CANINDEYU = "Canindeyu",
    NEEMBUCU = "Neembucu",
    AMAMBAY = "Amambay",
    PRESIDENTE_HAYES = "Presidente Hayes",
    BOQUERON = "Boqueron",
    ÑEEMBUCU = "Ñeembucu",
}

export enum DistritoEnum {
    ASUNCION = "Asuncion(Capital)",
    CONCEPCION = "Concepcion",
    SAN_PEDRO = "San Pedro",
    CDE = "Ciudad del Este",
}

export enum CiudadEnum {
    ASUNCION = "Asuncion",
    CDE = "CDE",
    ENCARNACION = "Encarnacion",
    CONCEPCION = "Concepcion",
}

export enum EstadoClienteEnum {
    ACTIVO = "activo",
    INACTIVO = "inactivo",
    PENDIENTE_VERIFICACION = "pendiente_verificacion",
}

export enum TipoCuentaEnum {
    CAJA_AHORRO = "caja_ahorro",
    CUENTA_CORRIENTE = "cuenta_corriente",
    PLAZO_FIJO = "plazo_fijo",
}

export enum MonedaEnum {
    PYG = "PYG",
    USD = "USD",
}

export enum EstadoCuentaEnum {
    ACTIVA = "activa",
    INACTIVA = "inactiva",
    BLOQUEADA = "bloqueada",
    CERRADA = "cerrada",
}

export enum TipoTarjetaEnum {
    DEBITO = "debito",
    CREDITO = "credito",
}

export enum EstadoTarjetaEnum {
    ACTIVA = "activa",
    BLOQUEADA = "bloqueada",
    VENCIDA = "vencida",
    REPORTADA = "reportada",
}

export enum EstadoCajeroEnum {
    OPERATIVO = "operativo",
    MANTENIMIENTO = "mantenimiento",
    FUERA_SERVICIO = "fuera_servicio",
}

export enum TipoServicioEnum {
    LUZ = "luz",
    AGUA = "agua",
    TELEFONIA = "telefonia",
    IMPUESTOS = "impuestos",
}

export enum EstadoServicioEnum {
    ACTIVO = "activo",
    INACTIVO = "inactivo",
}

export enum TipoTransaccionEnum {
    RETIRO = "retiro",
    DEPOSITO = "deposito",
    TRANSFERENCIA = "transferencia",
    PAGO_SERVICIO = "pago_servicio",
    CONSULTA = "consulta",
}

export enum EstadoTransaccionEnum {
    COMPLETADA = "completada",
    PENDIENTE = "pendiente",
    RECHAZADA = "rechazada",
    REVERSADA = "reversada",
}

export enum EstadoPrestamoEnum {
    SOLICITADO = "solicitado",
    APROBADO = "aprobado",
    RECHAZADO = "rechazado",
    PAGADO = "pagado",
    MOROSO = "moroso",
}

export enum EstadoUsuarioEnum {
    ACTIVO = "activo",
    INACTIVO = "inactivo",
    BLOQUEADO = "bloqueado",
}

export enum RolNombreEnum {
    ADMINISTRADOR = "administrador",
    CAJERO = "cajero",
    EJECUTIVO_CUENTAS = "ejecutivo_cuentas",
    AUDITOR = "auditor",
    CLIENTE = "cliente",
}

export enum NivelCriticidadEnum {
    BAJO = "bajo",
    MEDIO = "medio",
    ALTO = "alto",
    CRITICO = "critico",
}

export enum LogNivelEnum {
    INFO = "info",
    ADVERTENCIA = "advertencia",
    ERROR = "error",
    CRITICO = "critico",
}







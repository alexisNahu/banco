import type {InsertTransaccion, SelectCuenta, SelectServicio, SelectTransaccion} from "../db/schema.js";
import * as transaccionRepository from '../repositorios/transacciones.repository.js'
import {
    ApiError, BadRequestError,
    handleError,
    InternalServerError,
    NotFoundError, UnprocessableEntityError,
} from "../apiErrores.js";
import type {TransaccionQueryData} from "../models/zod_schemas/transacciones.schemas.js";
import * as cuentasService from './cuentas.service.js'
import {type EstadoTransaccion, LIMITES_PENDIENTE} from "../models/models.js";


export async function procesarTransaccion(transaccion: InsertTransaccion) {
    try {
        const {emisor, destinatario} = await verificarCuentasDeTransaccion(transaccion)

        const {estado, razon} = determinarEstadoTransaccion(transaccion, emisor, destinatario)

        const newTransaccion: SelectTransaccion | undefined = await createTransaccion({...transaccion,
            estado: estado,
        })

        await updateCuentasDeTransaccion(emisor || undefined, destinatario || undefined, newTransaccion)

        if (!newTransaccion) throw new InternalServerError('Error creando la transaccion')

        return {transaccion: newTransaccion, estado: newTransaccion.estado, razon}

    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

async function updateCuentasDeTransaccion(
    emisor: SelectCuenta | undefined,
    destinatario: SelectCuenta | undefined,
    transaccion: SelectTransaccion
) {
    try {
        if (transaccion.estado === "completada") {
            if (emisor) {
                await cuentasService.updateMontoDeLaCuenta(emisor.id, 'disminuir', {
                    valor: Number(transaccion.monto),
                    moneda: emisor.moneda
                });
            }

            if (destinatario) {
                await cuentasService.updateMontoDeLaCuenta(destinatario.id,
                    transaccion.tipoTransaccion === 'retiro' ? 'disminuir': 'agregar', {
                    valor: Number(transaccion.monto),
                    moneda: destinatario.moneda
                });
            }
        } else {
            console.log(`Transacción ${transaccion.estado} - No se actualizan saldos`);
        }
    } catch (error) {
        console.error("Error al actualizar cuentas:", error);
        throw error;
    }
}

async function createTransaccion (transaccion: InsertTransaccion): Promise<SelectTransaccion> {
    try {
        const newTransaccion: SelectTransaccion | undefined = await transaccionRepository.insertTransaccion(transaccion)
        if (!newTransaccion) throw new InternalServerError('Error creando la transaccion')

        return newTransaccion
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

export async function getTransaccionById(id: string): Promise<SelectTransaccion> {
    try {
        const transaccion: SelectTransaccion | undefined = await transaccionRepository.selectTransaccionById(id)
        if (!transaccion) throw new NotFoundError(`No se encontro la transaccion con el id ${id}`)

        return transaccion
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

export async function getTransaccion(transaccion: TransaccionQueryData) {
    try {
        return await transaccionRepository.selectTransacciones(transaccion)
    } catch(e) {
        handleError(e as ApiError); throw e
    }
}
async function verificarCuentasDeTransaccion(transaccion: InsertTransaccion) {
    try {
        let destinatario = transaccion.cuentaDestinoId
            ? await cuentasService.getCuentaById(transaccion.cuentaDestinoId)
            : null;

        let emisor = transaccion.cuentaOrigenId
            ? await cuentasService.getCuentaById(transaccion.cuentaOrigenId)
            : null;

        // Validación general mínima
        if (!transaccion.cuentaDestinoId && !transaccion.cuentaOrigenId) {
            throw new BadRequestError('La transacción debe tener al menos una cuenta origen o destino');
        }

        // Validaciones específicas por tipo
        switch (transaccion.tipoTransaccion) {
            case 'transferencia':
                if (!emisor || !destinatario) {
                    throw new BadRequestError('La transferencia requiere cuenta emisora y destinataria');
                }
                break;

            case 'deposito':
                if (!destinatario) {
                    throw new BadRequestError('El depósito requiere una cuenta destinataria');
                }
                // Opcional: decidir si permitir o no emisor en depósitos
                if (emisor) {
                    throw new BadRequestError('El depósito no debe tener cuenta emisora');
                }
                break;

            case 'pago_servicio':
                if (!emisor) {
                    throw new BadRequestError('El pago de servicio requiere cuenta emisora');
                }
                throw new InternalServerError('No se ha implementado el pago de servicios aún')
                break;

            case 'retiro':
                if (!destinatario) {
                    throw new BadRequestError('El retiro necesita de una cuenta destinataria')
                }
                break;

            default:
                throw new BadRequestError(`Tipo de transacción no válido: ${transaccion.tipoTransaccion}`);
        }

        return { emisor, destinatario };

    } catch (e: any) {
        handleError(e as ApiError);
        throw e;
    }
}
function determinarEstadoTransaccion(
    transaccion: InsertTransaccion,
    emisor: SelectCuenta | null,
    destinatario: SelectCuenta | null
): { estado: EstadoTransaccion; razon: string } {

    // 1. Validaciones por tipo de transacción
    switch (transaccion.tipoTransaccion) {
        case "deposito":
            if (!destinatario) {
                return { estado: "rechazada", razon: "El depósito requiere una cuenta destinataria" };
            }
            return { estado: "completada", razon: "Depósito procesado exitosamente" };

        case "transferencia":
            if (!emisor || !destinatario) {
                return { estado: "rechazada", razon: "La transferencia requiere emisor y destinatario" };
            }
            break;

        case "retiro":
            if (!emisor) {
                return {estado: "rechazada", razon: "El retiro requiere una cuenta destinataria"}
            }
            break;

        default:
            if (!emisor) {
                return { estado: "rechazada", razon: "La transacción requiere una cuenta emisora" };
            }
    }

    // 2. Si llegamos aquí, emisor existe (excepto para depósitos)
    const emisorSafe = emisor!;
    const montoNum = Number(transaccion.monto);

    // 3. Validaciones de moneda
    if (transaccion.moneda !== emisorSafe.moneda) {
        return {
            estado: "rechazada",
            razon: `Moneda incompatible: Transacción en ${transaccion.moneda}, Cuenta en ${emisorSafe.moneda}`
        };
    }

    if (montoNum > Number(emisorSafe.saldoDisponible)) {
        return { estado: "rechazada", razon: "Fondos insuficientes" };
    }

    if (montoNum > Number(emisorSafe.limiteTransferenciaDiaria)) {
        return { estado: "rechazada", razon: "Límite diario excedido" };
    }

    if (montoNum > LIMITES_PENDIENTE[emisorSafe.tipoCuenta][emisorSafe.moneda]) {
        return { estado: "pendiente", razon: "Monto alto - requiere aprobación manual" };
    }

    // 5. Validaciones específicas de transferencia
    if (transaccion.tipoTransaccion === "transferencia" && destinatario) {
        if (destinatario.estado !== "activa") {
            return { estado: "rechazada", razon: "Cuenta destinataria inactiva" };
        }
        if (destinatario.moneda !== emisorSafe.moneda) {
            return { estado: "rechazada", razon: "Monedas de cuentas no coinciden" };
        }
    }

    if (transaccion.tipoTransaccion === 'retiro' && destinatario) {
        if (destinatario.estado !== 'activa') {
            return {estado: "rechazada", razon: "Cuenta destinataria inactiva"}
        }
    }

    return { estado: "completada", razon: "Transacción procesada exitosamente" };
}

export async function reversarTransaccion(id: string) {
    try {
        const transaccion: SelectTransaccion = await getTransaccionById(id)

        const emisor = transaccion.cuentaOrigenId ? await cuentasService.getCuentaById(transaccion.cuentaOrigenId) : null
        const destinatario = transaccion.cuentaDestinoId ? await cuentasService.getCuentaById(transaccion.cuentaDestinoId) : null

        switch (transaccion.tipoTransaccion) {
            case 'transferencia':
                if (!emisor || !destinatario) throw new UnprocessableEntityError(`Ya no existe ni el emisario id: ${emisor?.id} o el destinatario id:${destinatario?.id}`)
                await procesarTransaccion({
                    tipoTransaccion: "transferencia",
                    estado: "reversada",
                    moneda: transaccion.moneda,
                    monto: transaccion.monto,
                    cuentaOrigenId: transaccion.cuentaDestinoId,
                    cuentaDestinoId: transaccion.cuentaOrigenId
                })
                break;


        }
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}
import {MONEDAS_CONVERSIONES} from "../models/models.js";

export function convertirMoneda (monto: number, monedaInicial: 'PYG' | 'USD', monedaFinal: 'PYG' | 'USD') {
    if (monedaInicial === 'PYG' && monedaFinal === 'USD') return monto * MONEDAS_CONVERSIONES.PYG_USD
    if (monedaInicial === 'USD' && monedaFinal === 'PYG') return monto * MONEDAS_CONVERSIONES.USD_PYG
    return monto
}
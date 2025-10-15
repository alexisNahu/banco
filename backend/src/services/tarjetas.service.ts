import {
    type InsertTarjeta,
    type SelectTarjeta,
} from "../db/schema.js";
import * as tarjetasRepository from "../repositorios/tarjetas.repository.js"
import type { TarjetaQueryData } from "../models/zod_schemas/tarjetas.schemas.js";
import {ApiError, handleError, InternalServerError, NotFoundError} from "../apiErrores.js";

export async function createTarjeta(data: InsertTarjeta): Promise<SelectTarjeta> {
    try {
        const response: SelectTarjeta | undefined = await tarjetasRepository.insertTarjeta(data)
        if (!response) throw new InternalServerError(`Error creando tarjeta ${data}`)

        return response
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

export async function getTarjetas(query: Partial<SelectTarjeta>): Promise<SelectTarjeta[]> {
    try {
        const response: SelectTarjeta[] | undefined = await tarjetasRepository.selectTarjetas(query);
        if (!response) throw new InternalServerError(`Error creando tarjeta ${query}`)

        return response
    } catch (e) {
        handleError(e as ApiError); throw e
    }
}

export async function updateTarjeta(
    id: string,
    fields: Partial<InsertTarjeta>
): Promise<{ prevTarjeta: SelectTarjeta; updatedTarjeta: SelectTarjeta }> {
    try {
        const prevTarjeta: SelectTarjeta | undefined = await tarjetasRepository.selectTarjetaById(id);
        if (!prevTarjeta) throw new NotFoundError(`No se encontró la tarjeta con id ${id}`);

        const updatedTarjeta: SelectTarjeta | undefined = await tarjetasRepository.updateTarjeta(fields, id);
        if (!updatedTarjeta) throw new InternalServerError('Error actualizando la tarjeta')
        return { prevTarjeta, updatedTarjeta };
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }

}

export async function deleteTarjeta(id: string): Promise<SelectTarjeta> {
    try {
        const deletedTarjeta = await tarjetasRepository.deleteTarjeta(id);
        if (!deletedTarjeta) throw new NotFoundError(`No se encontró la tarjeta con id ${id}`);
        return deletedTarjeta;
    } catch (e: any) {
        handleError(e as ApiError); throw e
    }
}

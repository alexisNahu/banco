import * as clientesService from '../services/clientes.service.js';
import { ApiError } from "../apiErrores.js";
export const clientesController = {
    post: async (req, res) => {
        try {
            const newCliente = await clientesService.createCliente(req.body);
            return res.status(200).json({ msg: 'Cliente registrado con exito' });
        }
        catch (e) {
            res.status(e instanceof ApiError ? e.statusCode : 500).json({ details: e.message });
        }
    }
};

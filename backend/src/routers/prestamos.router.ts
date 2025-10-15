import {Router} from "express";
import {prestamosController} from "../controllers/prestamos.controllers.js";
import {validateSchema} from "../middlewares/validation.schemas.js";
import {
    AprobarPrestamoSchema,
    CreatePrestamoSchema,
    DeletePrestamoSchema, MorosoPrestamoSchema, PagarPrestamoSchema,
    ReadPrestamoSchema, RechazarPrestamoSchema, UpdatePrestamoSchema
} from "../models/zod_schemas/prestamos.schemas.js";

const prestamosRouter: Router = Router()

prestamosRouter.route('/')
    .get(validateSchema(ReadPrestamoSchema), prestamosController.read)
    .post(validateSchema(CreatePrestamoSchema), prestamosController.create)
prestamosRouter.route('/:prestamoId')
    .delete(validateSchema(DeletePrestamoSchema), prestamosController.delete)
    .patch(validateSchema(UpdatePrestamoSchema), prestamosController.update)

prestamosRouter.route('/aprobar/:prestamoId').post(validateSchema(AprobarPrestamoSchema), prestamosController.aprobarPrestamo)
prestamosRouter.route('/rechazar/:prestamoId').post(validateSchema(RechazarPrestamoSchema), prestamosController.rechazarPrestamo)
prestamosRouter.route('/marcarMoroso/:prestamoId').post(validateSchema(MorosoPrestamoSchema), prestamosController.marcarPrestamoMoroso)
prestamosRouter.route('/pagar/:prestamoId').post(validateSchema(PagarPrestamoSchema), prestamosController.pagarPrestamo)


export default prestamosRouter
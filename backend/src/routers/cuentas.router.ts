import {Router} from "express";
import {validateSchema} from "../middlewares/validation.schemas.js";
import {
    CreateCuentaSchema,
    DeleteCuentaSchema,
    ReadCuentaSchema,
    UpdateCuentaSchema
} from "../models/zod_schemas/cuentas.schemas.js";
import {cuentasController} from "../controllers/cuentas.controllers.js";

const cuentasRouter: Router = Router()

cuentasRouter.route('/')
    .post(validateSchema(CreateCuentaSchema), cuentasController.create)
    .get(validateSchema(ReadCuentaSchema), cuentasController.read)
cuentasRouter.route('/:id')
    .patch(validateSchema(UpdateCuentaSchema), cuentasController.update)
    .delete(validateSchema(DeleteCuentaSchema), cuentasController.delete)

export default cuentasRouter
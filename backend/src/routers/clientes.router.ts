import express, {type Router} from "express";
import {validatePermisos, validateSchema} from "../middlewares/validation.schemas.js";
import {
    CreateClienteSchema,
    DeleteClienteSchema,
    ReadClienteSchema,
    UpdateClienteSchema
} from "../models/zod_schemas/clientes.schemas.js";
import {clientesController} from "../controllers/clientes.controllers.js";
import {Permiso} from "../models/models.js";

const clientesRouter: Router = express.Router()

clientesRouter.route('/')
    .post(validateSchema(CreateClienteSchema), clientesController.create)
    .get(validateSchema(ReadClienteSchema),  clientesController.read)

clientesRouter.route('/:id')
    .patch(validateSchema(UpdateClienteSchema), clientesController.update)
    .delete(validateSchema(DeleteClienteSchema), clientesController.delete)

export default clientesRouter
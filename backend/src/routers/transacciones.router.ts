import {Router} from "express";
import {transaccionControllers} from "../controllers/transaccion.controllers.js";
import {validateSchema} from "../middlewares/validation.schemas.js";
import {CreateTransaccionSchema, ReadTransaccionSchema} from "../models/zod_schemas/transacciones.schemas.js";

const transaccionesRouter = Router()

transaccionesRouter.route('/')
    .post(validateSchema(CreateTransaccionSchema), transaccionControllers.create)
    .get(validateSchema(ReadTransaccionSchema), transaccionControllers.read)

export default transaccionesRouter


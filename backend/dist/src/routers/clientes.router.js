import express, {} from "express";
import { validateSchema } from "../middlewares/validation.schemas.js";
import { CreateClienteSchema } from "../models/zod_schemas/clientes.schemas.js";
import { clientesController } from "../controllers/clientes.controllers.js";
const clientesRouter = express.Router();
clientesRouter.route('/').post(validateSchema(CreateClienteSchema), clientesController.post);
export default clientesRouter;

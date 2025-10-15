import {Router} from "express";
import {usuariosSistemaControllers} from "../controllers/usuarios_sistema.controllers.js";
import {RequestSchema, validateSchema} from "../middlewares/validation.schemas.js";
import { ReadUsuarioSistemaSchema } from "../models/zod_schemas/usuarios_sistema.schemas.js";


const usuariosRouter = Router()

usuariosRouter.route('/').get(validateSchema(ReadUsuarioSistemaSchema), usuariosSistemaControllers.read)

export default usuariosRouter
import {Router} from "express";
import {usuariosSistemaControllers} from "../controllers/usuarios_sistema.controllers.js";
import {RequestSchema, validateSchema, validateToken} from "../middlewares/validation.schemas.js";
import {ReadUsuarioSistemaSchema, UpdateUsuarioSistemaSchema} from "../models/zod_schemas/usuarios_sistema.schemas.js";


const usuariosRouter: Router = Router()

usuariosRouter.route('/').get(validateSchema(ReadUsuarioSistemaSchema), usuariosSistemaControllers.read)
usuariosRouter.route('/:id').patch(validateSchema(UpdateUsuarioSistemaSchema), usuariosSistemaControllers.update)

export default usuariosRouter
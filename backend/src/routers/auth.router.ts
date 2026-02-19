import {Router} from "express";
import {authController} from "../controllers/auth.controller.js";
import {validateSchema, validateToken} from "../middlewares/validation.schemas.js";
import {LoginSchema, RegisterSchema} from "../models/zod_schemas/auth.schemas.js";

const authRouter: Router = Router()

authRouter.route('/login').post(validateSchema(LoginSchema), authController.login)
authRouter.route('/register').post(validateSchema(RegisterSchema), authController.register)
authRouter.route('/logout').post(validateToken(), authController.logout)
authRouter.route('/me').get(authController.me)

export default authRouter
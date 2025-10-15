import {Router} from "express";
import {tarjetasController} from "../controllers/tarjetas.controller.js";

const tarjertasRouter: Router = Router()

tarjertasRouter.route('/')
    .get(tarjetasController.read)
    .post(tarjetasController.create)
    .patch(tarjetasController.update)
    .delete(tarjetasController.delete)

export default tarjertasRouter
import express, {type Router} from "express";
import clientesRouter from "./clientes.router.js";
import authRouter from "./auth.router.js";
import cuentasRouter from "./cuentas.router.js";
import transaccionesRouter from "./transacciones.router.js";
import prestamosRouter from "./prestamos.router.js";
import usuariosRouter from "./usuarios_sistema.router.js";

const appRouter: Router = express.Router();

appRouter.use('/clientes', clientesRouter)
appRouter.use('/auth', authRouter)
appRouter.use('/cuentas', cuentasRouter)
appRouter.use('/transacciones', transaccionesRouter)
appRouter.use('/prestamos', prestamosRouter)
appRouter.use('/usuarios', usuariosRouter)

export default appRouter


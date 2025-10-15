import express, {} from "express";
import clientesRouter from "./clientes.router.js";
const appRouter = express.Router();
appRouter.use('/clientes', clientesRouter);
export default appRouter;

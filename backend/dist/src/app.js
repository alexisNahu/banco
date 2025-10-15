import express, {} from 'express';
import { config } from "../config.js";
import appRouter from "./routers/app.router.js";
const app = express();
const app_port = config.app.port; // Puerto en el que corre la aplicacion
app.use(appRouter);
app.listen(app_port, () => {
    console.log('Listening on port', app_port);
});

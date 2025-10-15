import express, {type Express} from 'express'
import cookieParser from 'cookie-parser'
import {config} from "../config.js";
import cors from 'cors'
import appRouter from "./routers/app.router.js";

const app: Express = express()

const app_port: number = config.app.port; // Puerto en el que corre la aplicacion

app.use(express.json())
app.use(cors(config.cors))
app.use(cookieParser())
app.use(appRouter)

app.listen(app_port, () => console.log('Listening on port', app_port))
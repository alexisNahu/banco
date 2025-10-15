import { config as configDotenv } from "dotenv";
configDotenv();

export const config = {
    db: {
        host: process.env.DB_HOST ?? 'localhost',
        user: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? '1234',
        name: process.env.DB_NAME ?? 'banco',
        url: process.env.DB_URL ?? 'postgresql://postgres:1234@localhost:5432/banco'
    },
    app: {
        port: Number(process.env.APP_PORT ?? 3000),
    },
    jwt: {
        secret: process.env.SECRET_JWT ?? 'kajdfñÑJAOIPJPIJñJKñJñjIJfpj46465489f4___!!!!a4d64',
        refreshSecret: process.env.SECRET_REFRESH_JWT ?? 'kajdfñjíjIPIPJPIJPJFIjakdsjfñad198347019837401387401',
    },
    cors: {
        origin: 'http://localhost:4200',
        credentials: true
    }
} as const;

import { defineConfig } from 'drizzle-kit';
import { configDotenv } from "dotenv";
import { config } from "./config.js";
configDotenv();
export default defineConfig({
    out: './src/db/migrations',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: config.db.url,
    },
});
//# sourceMappingURL=drizzle.config.js.map
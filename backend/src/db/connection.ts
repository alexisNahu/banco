import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {config} from "../../config.js";

const pool = new Pool({
    connectionString: config.db.url,
    max: 20,
    idleTimeoutMillis: 30000,
});
export const db = drizzle({ client: pool });

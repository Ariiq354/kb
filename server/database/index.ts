import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../../shared/env";
import { relations } from "./relations";

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
  },
  relations,
});

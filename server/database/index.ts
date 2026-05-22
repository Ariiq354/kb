import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../../shared/env";
import * as auth from "./schema/auth";

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
  },
  schema: {
    ...auth,
  },
  casing: "snake_case",
});

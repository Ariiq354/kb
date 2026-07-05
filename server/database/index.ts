import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../../shared/env";
import * as auth from "./schema/auth";
import * as bootcamp from "./schema/bootcamp";
import * as course from "./schema/course";
import * as diskon from "./schema/diskon";
import * as ebook from "./schema/ebook";
import * as produk from "./schema/produk";
import * as taaruf from "./schema/taaruf";
import * as user from "./schema/user";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  schema: {
    ...auth,
    ...diskon,
    ...produk,
    ...bootcamp,
    ...ebook,
    ...course,
    ...taaruf,
    ...user,
  },
  casing: "snake_case",
});

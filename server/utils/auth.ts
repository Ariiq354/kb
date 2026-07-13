import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { db } from "../database";
import * as schema from "../database/schema/auth";

export const auth = betterAuth({
  trustedOrigins: [
    "https://keluargabahagia.id",
    "https://*.keluargabahagia.id",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 7,
  },
  advanced: {
    database: {
      generateId: false,
      useNumberId: true,
    },
  },
  user: {
    additionalFields: {
      noTelepon: { type: "string", required: true },
    },
  },
  plugins: [admin()],
});

export type UserWithId = Omit<typeof auth.$Infer.Session.user, "id"> & {
  id: number;
};

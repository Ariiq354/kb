import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugins } from "better-auth/plugins";
import { ac, admin, user } from "~~/shared/permission";
import { db } from "../database";

export const auth = betterAuth({
  trustedOrigins: [
    "https://keluargabahagia.id",
    "https://*.keluargabahagia.id",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
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
    modelName: "userTable",
    additionalFields: {
      noTelepon: { type: "string", required: true },
    },
  },
  plugins: [
    adminPlugins({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});

export type UserWithId = Omit<typeof auth.$Infer.Session.user, "id"> & {
  id: number;
};

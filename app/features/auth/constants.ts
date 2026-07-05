import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().min(1, "Wajib diisi"),
  password: z.string().min(1, "Wajib diisi"),
  rememberMe: z.boolean(),
});

export const initFormDataLogin: LoginSchema = {
  email: "",
  password: "",
  rememberMe: false,
};

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Wajib diisi"),
  email: z.email().min(1, "Wajib diisi"),
  noTelepon: z.string().min(1, "Wajib diisi"),
  password: z.string().min(8, "Jumlah karakter wajib ada 8"),
});

export const initFormDataRegister: RegisterSchema = {
  name: "",
  email: "",
  noTelepon: "",
  password: "",
};

export type RegisterSchema = z.infer<typeof registerSchema>;

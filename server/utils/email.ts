import type { ContactSchema } from "./schema";
import { Resend } from "resend";
import { env } from "~~/shared/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendContactEmail(data: ContactSchema) {
  return resend.emails.send({
    from: "noreply@mail.keluargabahagia.id",
    to: "halokeluargabahagia@gmail.com",
    subject: `Pesan Kontak dari ${data.name}`,
    html: `
      <h2>Pesan Kontak Baru</h2>
      <p><strong>Nama:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Pesan:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  });
}

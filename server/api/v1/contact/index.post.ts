import { sendContactEmail } from "~~/server/utils/email";
import { contactSchema } from "~~/server/utils/schema";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBodySafe(event, contactSchema);
  await sendContactEmail(body);
  return { success: true };
});

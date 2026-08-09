import type { H3Event } from "h3";
import { z } from "zod";

export async function getValidatedQuerySafe<T>(
  event: H3Event,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const result = await getValidatedQuery(event, schema.safeParse);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid query",
      data: z.treeifyError(result.error),
    });
  }

  return result.data;
}

export async function readValidatedBodySafe<T>(
  event: H3Event,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const result = await readValidatedBody(event, schema.safeParse);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid body",
      data: z.treeifyError(result.error),
    });
  }

  return result.data;
}

export async function getValidatedRouterParamsSafe<T>(
  event: H3Event,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const result = await getValidatedRouterParams(event, schema.safeParse);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid params",
      data: z.treeifyError(result.error),
    });
  }

  return result.data;
}

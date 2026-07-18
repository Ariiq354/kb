import type { UserWithId } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  event.context.user = session?.user as unknown as UserWithId;
  event.context.user = session?.user
    ? {
        ...session.user,
        id: Number(session.user.id),
      }
    : undefined;
});

declare module "h3" {
  interface H3EventContext {
    user: UserWithId | undefined;
  }
}

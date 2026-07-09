import { authClient } from "~/utils/auth";

export async function useAuthSession() {
  const relativeFetch = ((url: string, opts?: any) => {
    try {
      if (url.startsWith("http")) {
        url = new URL(url).pathname;
      }
    }
    catch {}
    return useFetch(url, opts);
  }) as any;

  const { data, isPending, error } = await authClient.useSession(relativeFetch);

  return {
    session: data,
    isPending,
    error,
  };
}

import type { auth } from "~~/server/utils/auth";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";
import { ac, admin, user } from "~~/shared/permission";
import { useToastError, useToastSuccess } from "~/composables/toast";

const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});

interface TSignIn {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface TSignUp {
  email: string;
  password: string;
  name: string;
  noTelepon: string;
}

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(
    null,
  );

  const user = computed(() => session.value?.data?.user);
  const loading = ref(false);

  async function init() {
    loading.value = true;
    const data = await authClient.useSession(useFetch);
    session.value = data;
    loading.value = false;
  }

  async function signIn(body: TSignIn) {
    loading.value = true;
    await authClient.signIn.email({
      ...body,
      callbackURL: "/dashboard",
      fetchOptions: {
        onError: (body) => {
          useToastError("Login Gagal", body.error.message);
        },
      },
    });
    loading.value = false;
  }

  async function signUp(body: TSignUp) {
    loading.value = true;
    await authClient.signUp.email({
      ...body,
      fetchOptions: {
        onError: (body) => {
          useToastError("Register Gagal", body.error.message);
        },
        onSuccess: () => {
          useToastSuccess("Register Sukses", "Silahkan login untuk masuk");
        },
      },
    });
    navigateTo("/login");
    loading.value = false;
  }

  async function signOut() {
    loading.value = true;
    await authClient.signOut({
      fetchOptions: {
        onError: (body) => {
          useToastError("Logout Failed", body.error.message);
        },
      },
    });
    navigateTo("/");
    loading.value = false;
  }

  // function hasPermission(body: TStatement) {
  //   const result = authClient.admin.checkRolePermission({
  //     permission: body,
  //     role: user.value?.role as "user" | "admin",
  //   });

  //   return result;
  // }

  async function updateUser(body: { name?: string; noTelepon?: string }) {
    loading.value = true;
    await authClient.updateUser({
      ...body,
      fetchOptions: {
        onError: (body) => {
          useToastError("Update Gagap", body.error.message);
        },
        onSuccess: () => {
          useToastSuccess("Update Sukses", "Profil anda berhasil diupdate");
        },
      },
    });
    loading.value = false;
  }

  async function deleteUser(id: number) {
    loading.value = true;

    await authClient.admin.removeUser({
      userId: id,
      fetchOptions: {
        onError: (body) => {
          useToastError("Delete Gagal", body.error.message);
        },
        onSuccess: () => {
          useToastSuccess("Delete Success", "User berhasil di delete");
        },
      },
    });
    loading.value = false;
  }

  return {
    init,
    loading,
    signIn,
    signUp,
    user,
    signOut,
    // hasPermission,
    updateUser,
    session,
    deleteUser,
  };
});

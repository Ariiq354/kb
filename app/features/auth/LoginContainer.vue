<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { LoginSchema } from "./constants";
import { initFormDataLogin, loginSchema } from "./constants";

const state = ref(initFormDataLogin);

const isLoading = ref(false);
async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  await authClient.signIn.email({
    email: event.data.email,
    password: event.data.password,
    rememberMe: event.data.rememberMe,
  }, {
    onRequest: () => {
      isLoading.value = true;
    },
    onSuccess: async () => {
      isLoading.value = false;
      await navigateTo("/dashboard", { external: true });
    },
    onError: () => {
      isLoading.value = false;
      useToastError("Gagal login", "Username atau password salah, silahkan coba lagi.");
    },
  });
}
</script>

<template>
  <UCard class="w-full max-w-md">
    <div class="space-y-6">
      <div class="flex flex-col items-center text-center">
        <NuxtLink href="/">
          <NuxtImg src="/logo.webp" width="150" height="150" alt="logo" />
        </NuxtLink>
        <div class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Selamat Datang
        </div>
        <div class="mt-1 text-gray-500 dark:text-gray-400">
          Belum punya akun?
          <NuxtLink
            no-prefetch
            to="/register"
            class="text-primary font-medium"
          >
            Daftar.
          </NuxtLink>
        </div>
      </div>
      <UForm
        :schema="loginSchema"
        :state="state"
        class="w-full space-y-6"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            :disabled="isLoading"
            icon="i-lucide-mail"
            placeholder="Masukkan email anda"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <InputPassword
            v-model="state.password"
            :disabled="isLoading"
            icon="i-lucide-lock"
            placeholder="Masukkan password anda"
          />
        </UFormField>

        <UCheckbox v-model="state.rememberMe" label="Ingat saya" :disabled="isLoading" />

        <UButton
          class="flex w-full justify-center"
          type="submit"
          :loading="isLoading"
        >
          Masuk
        </UButton>
      </UForm>
    </div>
  </UCard>
</template>

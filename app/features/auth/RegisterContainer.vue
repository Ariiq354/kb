<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { RegisterSchema } from "./constants";
import { authClient } from "~/utils/auth";
import { initFormDataRegister, registerSchema } from "./constants";

const state = ref(initFormDataRegister);

const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  await authClient.signUp.email({
    name: event.data.name,
    noTelepon: event.data.noTelepon,
    email: event.data.email,
    password: event.data.password,
  }, {
    onRequest: () => {
      isLoading.value = true;
    },
    onSuccess: async () => {
      isLoading.value = false;
      useToastSuccess("Berhasil registrasi", "Berhasil registrasi, silahkan login dengan akun anda");
      await navigateTo("/login");
    },
    onError: () => {
      isLoading.value = false;
      useToastError("Gagal registrasi", "Gagal registrasi, silahkan coba lagi.");
    },
  });
}
</script>

<template>
  <UCard class="w-full max-w-md">
    <div class="space-y-6">
      <div class="flex flex-col items-center text-center">
        <NuxtImg src="/logo.webp" width="130" alt="logo" class="m-8" />
        <div
          class="text-primary-500 dark:text-primary-400 text-2xl font-bold tracking-widest"
        >
          KELUARGA
          <span class="text-black dark:text-white">BAHAGIA</span>
        </div>
        <div class="mt-2 text-center">
          Sudah Punya Akun?
          <NuxtLink href="/login" class="text-primary">
            Login!
          </NuxtLink>
        </div>
      </div>
      <UForm
        :schema="registerSchema"
        :state="state"
        class="w-full space-y-6"
        @submit="onSubmit"
      >
        <UFormField label="Nama Lengkap" name="name">
          <UInput
            v-model="state.name"
            icon="i-lucide-user"
            placeholder="Nama Lengkap"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="No Telepon" name="noTelepon">
          <UInput
            v-model="state.noTelepon"
            icon="i-lucide-phone"
            placeholder="81XXX"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            icon="i-lucide-mail"
            :disabled="isLoading"
            placeholder="Email"
          />
        </UFormField>
        <UFormField label="Password" name="password">
          <InputPassword
            v-model="state.password"
            :disabled="isLoading"
            icon="i-lucide-lock"
            placeholder="Password"
          />
        </UFormField>

        <UButton
          class="flex w-full justify-center"
          type="submit"
          :loading="isLoading"
        >
          Daftar
        </UButton>
      </UForm>
    </div>
  </UCard>
</template>

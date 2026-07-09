<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import InputPassword from "~/components/Custom/InputPassword.vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { authClient } from "~/utils/auth";

const emit = defineEmits<{ close: [] }>();

const schema = z.object({
  oldPassword: z.string().min(8, "Password minimal 8 karakter"),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
  confirmPassword: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
}).refine(data => data.newPassword === data.confirmPassword, {
  error: "Password tidak sama",
  path: ["confirmPassword"],
});

const state = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isLoading = ref(false);
async function onSubmit(event: FormSubmitEvent<z.infer<typeof schema>>) {
  isLoading.value = true;

  await authClient.changePassword({
    currentPassword: event.data.oldPassword,
    newPassword: event.data.newPassword,
  }, {
    onError(err) {
      if (err.error.code === "INVALID_PASSWORD") {
        useToastError("Submit Failed", "Password lama salah");
      }
      else {
        useToastError("Submit Failed", "Ganti Password Gagal");
      }
    },
    onResponse() {
      isLoading.value = false;
    },
    onSuccess() {
      useToastSuccess("Success", "Password berhasil diubah");
      emit("close");
    },
  });
}
</script>

<template>
  <UModal
    :ui="{ body: 'sm:max-w-lg' }"
    title="Ubah Password"
    description="Silakan masukkan password lama dan baru Anda."
  >
    <template #body>
      <UForm
        id="form-password"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="flex flex-col gap-4">
          <UFormField label="Password Lama" name="oldPassword">
            <InputPassword
              v-model="state.oldPassword"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField label="Password Baru" name="newPassword">
            <InputPassword
              v-model="state.newPassword"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField label="Konfirmasi Password" name="confirmPassword">
            <InputPassword
              v-model="state.confirmPassword"
              :disabled="isLoading"
            />
          </UFormField>
        </div>
      </UForm>
    </template>
    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="isLoading"
        @click="emit('close')"
      >
        Batal
      </UButton>
      <UButton
        type="submit"
        form="form-password"
        icon="i-lucide-check"
        :loading="isLoading"
      >
        Simpan
      </UButton>
    </template>
  </UModal>
</template>

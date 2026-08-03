<script setup lang="ts">
import { navigateTo } from "#imports";

const emit = defineEmits(["close"]);

function handleLogin() {
  emit("close");
  navigateTo("/login");
}
</script>

<template>
  <UModal
    title="Login Diperlukan"
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ body: 'sm:max-w-md' }"
  >
    <template #body>
      <div class="space-y-4 py-2 text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <UIcon name="i-lucide-log-in" size="28" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Anda Harus Login Terlebih Dahulu
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Untuk melakukan checkout dan mengamankan produk ini, silakan masuk ke akun Anda terlebih dahulu.
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          @click="emit('close')"
        >
          Batal
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-log-in"
          @click="handleLogin"
        >
          Login Sekarang
        </UButton>
      </div>
    </template>
  </UModal>
</template>

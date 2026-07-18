<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  partnerName: string;
  onConfirm: () => void | Promise<void>;
}>();

const isOpen = defineModel<boolean>("open", { default: true });
const isSubmitting = ref(false);

async function handleConfirm() {
  isSubmitting.value = true;
  try {
    await props.onConfirm();
    isOpen.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" title="Konfirmasi Pembatalan">
    <template #body>
      <div class="space-y-4 text-center py-4">
        <div class="bg-error-50 dark:bg-error-950/20 p-4 rounded-full text-error inline-block">
          <UIcon name="i-lucide-circle-alert" class="size-10" />
        </div>
        <div class="space-y-1">
          <h4 class="font-bold text-gray-900 dark:text-white text-lg">
            Batalkan Pengajuan Ta'aruf?
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Apakah Anda yakin ingin membatalkan pengajuan ta'aruf dengan <span class="font-bold text-gray-900 dark:text-white">{{ partnerName }}</span>? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton color="neutral" variant="subtle" @click="() => { isOpen = false; }">
          Kembali
        </UButton>
        <UButton color="error" :loading="isSubmitting" @click="handleConfirm">
          Ya, Batalkan
        </UButton>
      </div>
    </template>
  </UModal>
</template>

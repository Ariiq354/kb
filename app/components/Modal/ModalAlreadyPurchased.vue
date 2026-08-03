<script setup lang="ts">
import { computed } from "vue";
import { navigateTo } from "#imports";

const props = defineProps<{
  produk: {
    id: number;
    type: "BOOTCAMP" | "EBOOK" | "COURSE" | string;
    judul: string;
  };
}>();

const emit = defineEmits(["close"]);

const productTypePath = computed(() => {
  switch (props.produk.type) {
    case "EBOOK":
      return "ebook";
    case "COURSE":
      return "course";
    default:
      return "bootcamp";
  }
});

function goToDashboard() {
  emit("close");
  navigateTo(`/dashboard/user/produk/${productTypePath.value}`);
}
</script>

<template>
  <UModal
    title="Produk Sudah Dimiliki"
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ body: 'sm:max-w-md' }"
  >
    <template #body>
      <div class="space-y-4 py-2 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
          <UIcon name="i-lucide-check-circle" size="36" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Anda Sudah Memiliki Produk Ini
          </h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Anda telah berhasil membeli <span class="font-semibold text-gray-900 dark:text-white">{{ produk.judul }}</span>. Anda dapat langsung mengakses produk ini di dashboard.
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
          Tutup
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-arrow-right"
          @click="goToDashboard"
        >
          Lihat Produk Saya
        </UButton>
      </div>
    </template>
  </UModal>
</template>

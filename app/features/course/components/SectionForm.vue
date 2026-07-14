<script setup lang="ts">
import type { Section } from "../types";

defineProps<{
  selectedSection: Section | null;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "cancel"): void;
  (e: "delete", id: number): void;
}>();

const model = defineModel<{
  judul: string;
  order: number;
}>({ required: true });
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {{ selectedSection ? 'Edit Detail Section' : 'Tambah Section Baru' }}
      </h3>
      <p class="text-xs text-neutral-500">
        Section berguna untuk mengelompokkan beberapa materi video pembelajaran
      </p>
    </div>

    <div class="space-y-4">
      <UFormField label="Judul Section" name="section-judul" required>
        <UInput
          v-model="model.judul"
          placeholder="Contoh: Pengenalan dasar & terminologi..."
          class="w-full"
          :disabled="isLoading"
        />
      </UFormField>
      <UFormField label="Urutan" name="section-order" required>
        <UInputNumber
          v-model="model.order"
          :min="0"
          class="w-full"
          :disabled="isLoading"
        />
      </UFormField>
    </div>

    <div class="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800">
      <UButton
        v-if="selectedSection"
        color="error"
        variant="subtle"
        icon="i-lucide-trash-2"
        :disabled="isLoading"
        @click="emit('delete', selectedSection.id)"
      >
        Hapus Section
      </UButton>
      <div v-else />
      <div class="flex items-center gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          :disabled="isLoading"
          @click="emit('cancel')"
        >
          Batal
        </UButton>
        <UButton
          :loading="isLoading"
          icon="i-lucide-check"
          color="primary"
          @click="emit('submit')"
        >
          Simpan Section
        </UButton>
      </div>
    </div>
  </div>
</template>

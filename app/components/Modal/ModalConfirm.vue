<script lang="ts" setup>
import { useToastError, useToastSuccess } from "~/composables/toast";

const props = defineProps<{
  path: string;
  body: object;
  refresh: () => void;
}>();

const emit = defineEmits(["close"]);

const loading = ref(false);
async function onClick() {
  loading.value = true;
  try {
    await $fetch(`${props.path}`, {
      method: "DELETE",
      body: props.body,
      credentials: "include",
    });
    props.refresh();
    emit("close", false);

    useToastSuccess("Berhasil Hapus Data");
  }
  catch (error: any) {
    useToastError("Gagal Menghapus", error.data.message);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ body: 'sm:max-w-lg' }"
    title="Konfirmasi"
  >
    <template #body>
      <div class="space-y-5">
        <div class="flex items-center gap-4">
          <UIcon name="i-lucide-triangle-alert" size="36" />
          Apakah Anda yakin ingin menghapus item yang dipilih?
        </div>
      </div>
    </template>
    <template #footer>
      <UButton
        icon="i-lucide-x"
        :disabled="loading"
        class="text-base"
        variant="ghost"
        color="success"
        @click="emit('close')"
      >
        Tidak
      </UButton>
      <UButton
        icon="i-lucide-check"
        :loading="loading"
        color="error"
        class="text-base"
        @click="onClick"
      >
        Ya
      </UButton>
    </template>
  </UModal>
</template>

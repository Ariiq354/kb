<script setup lang="ts">
import { computed, watch } from "vue";
import { useDesa } from "~/composables/wilayah";

const props = defineProps<{
  kecamatanId?: number;
  disabled?: boolean;
}>();

const selectedDesa = defineModel<number>();

const { desa, loadingStates, fetchDesa } = useDesa();

let isFirstRun = true;
watch(
  () => props.kecamatanId,
  async (newKecamatanId) => {
    if (!isFirstRun) {
      selectedDesa.value = undefined;
    }
    isFirstRun = false;
    if (newKecamatanId) {
      await fetchDesa(newKecamatanId);
    }
  },
  { immediate: true },
);

const daftarDesa = computed(() => {
  if (!props.kecamatanId) {
    return [];
  }
  return desa.value[props.kecamatanId] || [];
});

const isLoading = computed(() => {
  return props.kecamatanId ? !!loadingStates.value[props.kecamatanId] : false;
});

// Guard the bound value to prevent rendering the raw number while options are loading
const selectValue = computed({
  get() {
    const val = selectedDesa.value;
    if (val === undefined || val === null) {
      return undefined;
    }
    const exists = daftarDesa.value.some(v => v.id === val);
    return exists ? val : undefined;
  },
  set(val) {
    selectedDesa.value = val;
  },
});
</script>

<template>
  <USelectMenu
    v-model="selectValue"
    :items="daftarDesa"
    label-key="name"
    value-key="id"
    :disabled="disabled || !kecamatanId || isLoading"
    :loading="isLoading"
    placeholder="Pilih Kelurahan / Desa"
  />
</template>

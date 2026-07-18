<script setup lang="ts">
import { computed, watch } from "vue";
import { useKota } from "~/composables/wilayah";

const props = defineProps<{
  provinsiId?: number;
  disabled?: boolean;
}>();

const selectedKota = defineModel<number>();

const { kota, loadingStates, fetchKota } = useKota();

let isFirstRun = true;
watch(
  () => props.provinsiId,
  async (newProvinsiId) => {
    if (!isFirstRun) {
      selectedKota.value = undefined;
    }
    isFirstRun = false;
    if (newProvinsiId) {
      await fetchKota(newProvinsiId);
    }
  },
  { immediate: true },
);

const daftarKota = computed(() => {
  if (!props.provinsiId) {
    return [];
  }
  return kota.value[props.provinsiId] || [];
});

const isLoading = computed(() => {
  return props.provinsiId ? !!loadingStates.value[props.provinsiId] : false;
});

// Guard the bound value to prevent rendering the raw number while options are loading
const selectValue = computed({
  get() {
    const val = selectedKota.value;
    if (val === undefined || val === null) {
      return undefined;
    }
    const exists = daftarKota.value.some(k => k.id === val);
    return exists ? val : undefined;
  },
  set(val) {
    selectedKota.value = val;
  },
});
</script>

<template>
  <USelectMenu
    v-model="selectValue"
    :items="daftarKota"
    label-key="name"
    value-key="id"
    :disabled="disabled || !provinsiId || isLoading"
    :loading="isLoading"
    placeholder="Pilih Kota / Kabupaten"
  />
</template>

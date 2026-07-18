<script setup lang="ts">
import { computed, watch } from "vue";
import { useKecamatan } from "~/composables/wilayah";

const props = defineProps<{
  kotaId?: number;
  disabled?: boolean;
}>();

const selectedKecamatan = defineModel<number>();

const { kecamatan, loadingStates, fetchKecamatan } = useKecamatan();

let isFirstRun = true;
watch(
  () => props.kotaId,
  async (newKotaId) => {
    if (!isFirstRun) {
      selectedKecamatan.value = undefined;
    }
    isFirstRun = false;
    if (newKotaId) {
      await fetchKecamatan(newKotaId);
    }
  },
  { immediate: true },
);

const daftarKecamatan = computed(() => {
  if (!props.kotaId) {
    return [];
  }
  return kecamatan.value[props.kotaId] || [];
});

const isLoading = computed(() => {
  return props.kotaId ? !!loadingStates.value[props.kotaId] : false;
});

// Guard the bound value to prevent rendering the raw number while options are loading
const selectValue = computed({
  get() {
    const val = selectedKecamatan.value;
    if (val === undefined || val === null) {
      return undefined;
    }
    const exists = daftarKecamatan.value.some(k => k.id === val);
    return exists ? val : undefined;
  },
  set(val) {
    selectedKecamatan.value = val;
  },
});
</script>

<template>
  <USelectMenu
    v-model="selectValue"
    :items="daftarKecamatan"
    label-key="name"
    value-key="id"
    :disabled="disabled || !kotaId || isLoading"
    :loading="isLoading"
    placeholder="Pilih Kecamatan"
  />
</template>

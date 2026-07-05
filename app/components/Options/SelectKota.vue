<script setup lang="ts">
import regencies from "~~/public/wilayah/regencies.json";

const props = defineProps<{
  provinceId?: string;
  disabled?: boolean;
}>();

const selectedRegency = defineModel<string>();

const filteredRegencies = computed(() =>
  regencies.filter(
    regency => regency.provinceId === props.provinceId,
  ),
);

watch(
  () => props.provinceId,
  () => {
    selectedRegency.value = undefined;
  },
);
</script>

<template>
  <USelectMenu
    v-model="selectedRegency"
    :items="filteredRegencies"
    label-key="name"
    value-key="id"
    :disabled="disabled || !provinceId"
    placeholder="Pilih Kota / Kabupaten"
  />
</template>

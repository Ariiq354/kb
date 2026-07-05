<script setup lang="ts">
import districts from "~~/public/wilayah/districts.json";

const props = defineProps<{
  regencyId?: string;
  disabled?: boolean;
}>();

const selectedDistrict = defineModel<string>();

const filteredDistricts = computed(() =>
  districts.filter(
    district => district.regencyId === props.regencyId,
  ),
);

watch(
  () => props.regencyId,
  () => {
    selectedDistrict.value = undefined;
  },
);
</script>

<template>
  <USelectMenu
    v-model="selectedDistrict"
    :items="filteredDistricts"
    label-key="name"
    value-key="id"
    :disabled="disabled || !regencyId"
    placeholder="Pilih Kecamatan"
  />
</template>

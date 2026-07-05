<script setup lang="ts">
import villages from "~~/public/wilayah/villages.json";

interface Village {
  id: string;
  name: string;
  districtId: string;
}

const props = defineProps<{
  districtId?: string;
  disabled?: boolean;
}>();

const selectedVillages = defineModel<string>();

const filteredVillages = computed(() =>
  (villages as Village[]).filter(
    village => village.districtId === props.districtId,
  ),
);

watch(
  () => props.districtId,
  () => {
    selectedVillages.value = undefined;
  },
);
</script>

<template>
  <USelectMenu
    v-model="selectedVillages"
    :items="filteredVillages"
    label-key="name"
    value-key="id"
    :disabled="disabled || !districtId"
    placeholder="Pilih Kelurahan / Desa"
  />
</template>

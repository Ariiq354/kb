<script setup lang="ts">
import provinsi from "~~/public/wilayah/provinces.json";

defineProps<{
  disabled?: boolean;
}>();

const selectedProvinsi = defineModel<string>();
</script>

<template>
  <USelectMenu
    v-model="selectedProvinsi"
    :items="provinsi"
    label-key="name"
    value-key="id"
    :disabled="disabled"
    placeholder="Pilih Provinsi"
  />
</template>

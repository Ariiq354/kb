<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useProvinsi } from "~/composables/wilayah";

defineProps<{
  disabled?: boolean;
}>();

const selectedProvinsi = defineModel<number>();

const { provinsi, isFetching, fetchProvinsi } = useProvinsi();

onMounted(async () => {
  await fetchProvinsi();
});

// Guard the bound value to prevent rendering the raw number while options are loading
const selectValue = computed({
  get() {
    const val = selectedProvinsi.value;
    if (val === undefined || val === null) {
      return undefined;
    }
    const exists = provinsi.value.some(p => p.id === val);
    return exists ? val : undefined;
  },
  set(val) {
    selectedProvinsi.value = val;
  },
});
</script>

<template>
  <USelectMenu
    v-model="selectValue"
    :items="provinsi"
    label-key="name"
    value-key="id"
    :disabled="disabled || isFetching"
    :loading="isFetching"
    placeholder="Pilih Provinsi"
  />
</template>

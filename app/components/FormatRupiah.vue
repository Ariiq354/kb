<script setup lang="ts">
import { computed } from "vue";
import { formatRupiahParts } from "~/utils/number";

interface Props {
  value: number;
  currencyClass?: string;
  numberClass?: string;
  wrapperClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currencyClass: "text-sm align-top",
  numberClass: "text-3xl font-bold",
  wrapperClass: "inline-flex items-baseline gap-0.5",
});

const parts = computed(() => formatRupiahParts(props.value));
</script>

<template>
  <span :class="wrapperClass">
    <span :class="currencyClass">{{ parts.currency }}</span>
    <span :class="numberClass">{{ parts.number }}</span>
  </span>
</template>

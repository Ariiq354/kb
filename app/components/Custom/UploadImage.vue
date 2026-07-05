<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled: boolean;
    foto: string | undefined;
    file?: File | undefined;
    ratio?: "1:1" | "16:9";
  }>(),
  {
    ratio: "1:1",
  },
);

const emit = defineEmits<{
  "update:foto": [string | undefined];
  "update:file": [File | undefined];
}>();

const foto = computed({
  get: () => props.foto,
  set: value => emit("update:foto", value),
});

const file = computed({
  get: () => props.file,
  set: value => emit("update:file", value),
});

const config = useRuntimeConfig();

const sizeClasses = computed(() => {
  return props.ratio === "16:9"
    ? "aspect-video w-72"
    : "aspect-square w-40";
});

const fileDescription = computed(() => {
  if (props.disabled)
    return undefined;
  return props.ratio === "16:9" ? "16:9, max. 5MB" : "max. 5MB";
});
</script>

<template>
  <div v-if="foto" class="group relative w-40">
    <NuxtImg :src="`${config.public.imageUrl}/${foto}`" class="aspect-square ring-1 ring-muted w-40 rounded-lg object-cover object-center" />
    <UButton
      v-if="!disabled"
      icon="i-lucide-x"
      color="neutral"
      :ui="{ leadingIcon: 'size-4' }"
      class="absolute -inset-e-1.5 -top-1.5 rounded-full p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
      @click="() => { foto = '' }"
    />
  </div>
  <UFileUpload
    v-else
    v-model="file"
    highlight
    color="neutral"
    icon="i-lucide-image"
    :description="fileDescription"
    :class="sizeClasses"
    :disabled="disabled"
  />
</template>

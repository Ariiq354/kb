<script setup lang="ts">
import { computed, ref } from "vue";

const messageMaxLength = 1000;
const message = ref("");

const messageCounterClass = computed(() => {
  if (message.value.length >= messageMaxLength) {
    return "text-error";
  }

  return "text-muted";
});
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl border border-muted px-4 py-6 shadow-xl sm:rounded-3xl sm:px-8 sm:py-8 lg:px-10">
    <div class="absolute top-0 left-0 h-1.25 w-full rounded-t-2xl bg-linear-to-r from-primary to-just-right" />

    <div class="flex items-start gap-3 sm:gap-4">
      <div class="shrink-0">
        <div class="flex items-center justify-center rounded-2xl bg-primary-100 p-3 sm:rounded-3xl sm:p-5">
          <UIcon name="i-lucide-message-square" class="text-xl text-primary sm:text-2xl" />
        </div>
      </div>
      <div>
        <p class="text-xl font-semibold text-primary sm:text-2xl">
          Kirim Pesan
        </p>
        <p class="mt-2 text-sm">
          Isi formulir di bawah ini dan kami akan segera menghubungi Anda.
        </p>
      </div>
    </div>

    <UForm class="mt-6 flex flex-col gap-5 sm:mt-8 sm:gap-6">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <UFormField label="Nama Lengkap" name="name" :ui="{ label: 'font-bold' }">
          <UInput placeholder="Contoh: Arif Budiman" :ui="{ base: 'placeholder:text-sm' }" />
        </UFormField>
        <UFormField label="Alamat Email" name="email" :ui="{ label: 'font-bold' }">
          <UInput placeholder="Contoh: arifbudiman@mail.com" :ui="{ base: 'placeholder:text-sm' }" />
        </UFormField>
      </div>
      <UFormField label="Pesan Anda" name="message" :ui="{ label: 'font-bold' }">
        <UTextarea
          v-model="message"
          :ui="{ base: 'placeholder:text-sm' }"
          placeholder="Ceritakan bagaimana kami dapat membantu Anda membangun hubungan yang lebih kuat..."
          :rows="10"
          :maxlength="messageMaxLength"
        />
        <p class="mt-2 text-right text-sm" :class="messageCounterClass">
          {{ message.length }}/{{ messageMaxLength }}
        </p>
      </UFormField>
    </UForm>
    <UButton class="w-full cursor-pointer sm:w-44 mt-4">
      <div class="flex items-center justify-center gap-4 w-full text-base">
        <UIcon name="i-lucide-send" />
        Kirim Pesan
      </div>
    </UButton>
    <div class="mt-6 flex items-start gap-2 text-muted sm:mt-10">
      <UIcon name="i-lucide-lock-keyhole" class="mt-0.5 shrink-0 text-base" />
      <p class="text-xs leading-5 sm:text-sm">
        Dengan mengirim pesan, Anda menyetujui kebijakan privasi kami dan bahwa informasi yang Anda berikan akan dijaga kerahasiaannya.
      </p>
    </div>
  </div>
</template>

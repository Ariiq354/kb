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
  <div class="relative shadow-xl rounded-3xl px-10 py-8 border border-gray-100 overflow-hidden">
    <div class="absolute top-0 left-0 h-1.25 w-full rounded-t-2xl bg-linear-to-r from-primary to-just-right" />

    <div class="flex gap-4">
      <div class="">
        <div class="flex items-center justify-center rounded-3xl bg-primary-100 p-5">
          <UIcon name="i-lucide-message-square" class="text-primary text-2xl" />
        </div>
      </div>
      <div>
        <p class="text-2xl text-primary-600 font-semibold">
          Kirim Pesan
        </p>
        <p class="mt-2 text-sm">
          Isi formulir di bawah ini dan kami akan segera menghubungi Anda.
        </p>
      </div>
    </div>

    <UForm class="flex flex-col gap-6 mt-8">
      <div class="grid grid-cols-2 gap-5">
        <UFormField label="Nama Lengkap" name="name" :ui="{ label: 'font-bold' }">
          <UInput placeholder="Contoh: Arif Budiman" />
        </UFormField>
        <UFormField label="Alamat Email" name="email" :ui="{ label: 'font-bold' }">
          <UInput placeholder="Contoh: arifbudiman@mail.com" />
        </UFormField>
      </div>
      <UFormField label="Pesan Anda" name="message" :ui="{ label: 'font-bold' }">
        <UTextarea
          v-model="message"
          placeholder="Ceritakan bagaimana kami dapat membantu Anda membangun hubungan yang lebih kuat..."
          :rows="10"
          :maxlength="messageMaxLength"
        />
        <p class="mt-2 text-right text-sm" :class="messageCounterClass">
          {{ message.length }}/{{ messageMaxLength }}
        </p>
      </UFormField>
    </UForm>
    <UButton class="w-44 cursor-pointer">
      <div class="flex items-center justify-center gap-4 w-full text-base">
        <UIcon name="i-streamline-send-email-remix" />
        Kirim Pesan
      </div>
    </UButton>
    <div class="flex items-start gap-2 mt-10">
      <UIcon name="i-lucide-lock-keyhole" class="text-base" />
      <p class="text-sm">
        Dengan mengirim pesan, Anda menyetujui kebijakan privasi kami dan bahwa informasi yang Anda berikan akan dijaga kerahasiaannya.
      </p>
    </div>
  </div>
</template>

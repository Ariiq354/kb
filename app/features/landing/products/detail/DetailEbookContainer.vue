<script setup lang="ts">
import { formatRupiah } from "~/utils/number";
import { DUMMY_EBOOK_DETAIL } from "./constant";

const kodeKupon = ref("");
const diskon = ref(0);
const isChecking = ref(false);
const kuponMessage = ref("");
const kuponValid = ref<boolean | null>(null);

const DUMMY_KUPON_CODE = "DISKON10";
const DUMMY_KUPON_PERCENT = 0.1;

const total = computed(() => DUMMY_EBOOK_DETAIL.harga - diskon.value);

function checkKupon() {
  if (!kodeKupon.value.trim()) {
    kuponMessage.value = "Masukkan kode kupon terlebih dahulu";
    kuponValid.value = false;
    return;
  }

  isChecking.value = true;
  kuponMessage.value = "";

  setTimeout(() => {
    if (kodeKupon.value.trim().toUpperCase() === DUMMY_KUPON_CODE) {
      diskon.value = Math.round(DUMMY_EBOOK_DETAIL.harga * DUMMY_KUPON_PERCENT);
      kuponValid.value = true;
      kuponMessage.value = "Kupon berhasil diterapkan!";
    }
    else {
      diskon.value = 0;
      kuponValid.value = false;
      kuponMessage.value = "Kode kupon tidak valid";
    }
    isChecking.value = false;
  }, 800);
}
</script>

<template>
  <main class="w-full min-h-screen bg-[url('/images/landingbg1.webp')] object-cover bg-repeat-y bg-center">
    <section class="container grid grid-cols-1 gap-6 px-4 py-6 md:px-6 md:py-10 lg:grid-cols-5 lg:gap-8">
      <div class="lg:col-span-3">
        <div class="rounded-xl border border-gray-300 bg-white p-5 shadow-md md:p-8">
          <div
            class="prose prose-base max-w-none md:prose-lg"
            v-html="DUMMY_EBOOK_DETAIL.detail"
          />
        </div>
      </div>

      <div class="h-fit rounded-xl border border-gray-300 bg-white px-5 py-5 shadow-md md:px-8 lg:col-span-2">
        <NuxtImg
          :src="DUMMY_EBOOK_DETAIL.image"
          class="mx-auto w-full max-w-80 rounded-xl object-cover"
        />

        <div class="mt-4">
          <p class="text-sm text-gray-400">
            Penulis
          </p>
          <p class="font-semibold">
            {{ DUMMY_EBOOK_DETAIL.penulis }}
          </p>
        </div>

        <div class="mt-4 flex flex-col gap-3 py-5 sm:flex-row sm:gap-4">
          <UInput
            v-model="kodeKupon"
            placeholder="Kode Kupon (jika ada)"
            class="w-full sm:flex-1"
            @keyup.enter="checkKupon"
          />
          <UButton
            :loading="isChecking"
            class="justify-center sm:w-auto"
            @click="checkKupon"
          >
            Check
          </UButton>
        </div>

        <p
          v-if="kuponMessage"
          class="-mt-3 mb-3 text-sm"
          :class="kuponValid ? 'text-green-600' : 'text-red-500'"
        >
          {{ kuponMessage }}
        </p>

        <div class="flex flex-col gap-2 border-y border-gray-300 py-4 text-sm font-extralight text-gray-500">
          <div class="flex justify-between gap-4">
            <p>Harga</p>
            <p>{{ formatRupiah(DUMMY_EBOOK_DETAIL.harga) }}</p>
          </div>
          <div class="flex justify-between gap-4">
            <p>Diskon</p>
            <p>{{ formatRupiah(diskon) }}</p>
          </div>
        </div>

        <div class="flex justify-between gap-4 py-5">
          <p class="font-extralight text-gray-500">
            Total
          </p>
          <FormatRupiah
            :value="total"
            number-class="text-xl font-bold text-black"
          />
        </div>

        <UButton class="flex w-full justify-center">
          Checkout
        </UButton>
      </div>
    </section>
  </main>
</template>

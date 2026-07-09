<script setup lang="ts">
import FormContact from "./components/FormContact.vue";
</script>

<template>
  <main class="container py-20 grid grid-cols-5 gap-20">
    <div class="col-span-5 md:col-span-2">
      <div class="">
        <h1 class="text-4xl font-bold ">
          Mari Memulai Perjalanan <span class="text-primary">Bersama</span>
        </h1>
        <p class="my-10">
          Apapun pertanyaan Anda tentang layanan pendampingan, jadwal bootcamp, atau mencari arahan, tim kami siap membantu Anda. Kamu mendengarkan setiap cerita dengan sepenuh hati dan memberikan solusi terbaik untuk Anda.
        </p>
        <div class="grid grid-cols-1 gap-5">
          <UCard>
            <div class="flex items-start gap-5">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full">
                <UIcon name="i-heroicons-envelope-solid" class="text-primary text-2xl" />
              </div>
              <div>
                <p class="text-lg text-primary font-semibold">
                  Dukungan Email
                </p>
                <p class="text-base text-black my-1">
                  test@mail.com
                </p>
                <p class="text-sm text-gray-600 font-light">
                  Balasan dikirim dalam 24 jam
                </p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-start gap-5">
              <div class="flex items-center justify-center w-12 h-12 bg-just-right rounded-full">
                <UIcon name="i-ion-location-sharp" class="text-amber-600 text-[26px]" />
              </div>
              <div>
                <p class="text-lg text-primary font-semibold">
                  Kunjungi Tempat Kami
                </p>
                <p class="text-base text-black mt-1 mb-2">
                  123 Jalan Raya Bogor, Peace Valley, Kota Bogor, 15911
                </p>
                <button class="flex items-center gap-3 font-medium text-primary cursor-pointer hover:underline">
                  <p class="font-light">
                    Lihat di Peta
                  </p>
                  <UIcon name="i-lucide-arrow-right" />
                </button>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
    <div class="col-span-5 md:col-span-3">
      <FormContact />
    </div>
  </main>
</template>

<script setup lang="ts">
import FormContact from "./components/FormContact.vue";
</script>

<template>
  <main class="container grid grid-cols-1 gap-20 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-5 md:gap-8 lg:gap-14 lg:py-20 xl:gap-20">
    <div class="md:col-span-2">
      <div>
        <h1 class="text-3xl leading-tight font-bold sm:text-4xl">
          Mari Memulai Perjalanan <span class="text-primary">Bersama</span>
        </h1>
        <p class="my-6 text-sm leading-7 text-muted sm:my-8 sm:text-base lg:my-10">
          Apapun pertanyaan Anda tentang layanan pendampingan, jadwal bootcamp, atau mencari arahan, tim kami siap membantu Anda. Kamu mendengarkan setiap cerita dengan sepenuh hati dan memberikan solusi terbaik untuk Anda.
        </p>
        <div class="grid grid-cols-1 gap-5">
          <UCard>
            <div class="flex items-start gap-5">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 sm:size-12">
                <UIcon name="i-heroicons-envelope-solid" class="text-xl text-primary sm:text-2xl" />
              </div>
              <div>
                <p class="text-lg text-primary font-semibold">
                  Dukungan Email
                </p>
                <p class="my-1 break-all text-sm text-default sm:text-base">
                  test@mail.com
                </p>
                <p class="text-sm font-light text-muted">
                  Balasan dikirim dalam 24 jam
                </p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-start gap-5">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-just-right sm:size-12">
                <UIcon name="i-ion-location-sharp" class="text-[22px] text-warning sm:text-[26px]" />
              </div>
              <div>
                <p class="text-lg text-primary font-semibold">
                  Kunjungi Tempat Kami
                </p>
                <p class="mt-1 mb-2 text-sm leading-6 text-default sm:text-base">
                  123 Jalan Raya Bogor, Peace Valley, Kota Bogor, 15911
                </p>
                <button type="button" class="flex cursor-pointer items-center gap-2 font-medium text-primary hover:underline sm:gap-3">
                  <p class="font-light text-sm">
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
    <div class="min-w-0 md:col-span-3">
      <FormContact />
    </div>
  </main>
</template>

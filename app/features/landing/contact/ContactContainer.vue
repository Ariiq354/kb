<script setup lang="ts">
import FormContact from "./components/FormContact.vue";
</script>

<template>
  <main>
    <section class="bg-[url('/images/landingbg1.webp')] object-cover bg-repeat-y bg-center py-20">
      <div class="container flex flex-col gap-60">
        <div class="flex flex-col items-center md:items-start gap-10 pt-12 md:flex-row">
          <div class="backdrop-blur-lg flex w-full flex-col gap-8 text-center md:w-1/2 md:text-left">
            <h1 class="text-4xl font-bold text-highlighted md:text-5xl">
              Kontak Kami
            </h1>

            <div class="space-y-5 text-justify text-base leading-8 text-toned md:text-lg">
              <p class="font-bold text-highlighted">
                Bingung Soal Cinta? Punya Keluhan Tentang Hubungan? Kami Siap Mendengar!
              </p>
              <p>
                Perjalanan cinta dan menemukan pasangan hidup bisa jadi rumit, penuh tantangan, atau bahkan terkadang terasa berat. Jika Anda sedang menghadapi kebuntuan dalam hubungan, mencari panduan untuk menemukan jodoh, atau memiliki keluhan seputar percintaan, kami ada untuk Anda.
              </p>
              <p>
                Kami memahami setiap hati memiliki kisahnya sendiri. Jangan pendam keresahan Anda! Bagikan pengalaman, pertanyaan, atau keluhan Anda melalui formulir di bawah ini. Untuk respons yang lebih cepat dan pribadi, gunakan fitur chat langsung kami.
              </p>
              <p class="font-bold italic text-highlighted">
                Ceritakan kisah cinta Anda kepada kami, dan mari kita wujudkan kebahagiaan yang Anda impikan.
              </p>
            </div>

            <div>
              <UButton
                to="https://wa.me/6285772048120"
                target="_blank"
                rel="noopener noreferrer"
                icon="i-mdi-whatsapp"
                color="neutral"
                variant="solid"
                size="xl"
                label="WhatsApp Kami"
                class="rounded-md bg-default px-5 py-3 font-bold text-highlighted shadow-sm hover:bg-muted"
                :ui="{ leadingIcon: 'size-8 text-[#25D366]' }"
              />
            </div>
          </div>

          <div class="flex w-full justify-center md:w-1/2">
            <NuxtImg
              src="/images/kontak-image-kb.avif"
              alt="Ilustrasi kontak Keluarga Bahagia"
              width="1647"
              height="1647"
              densities="x1 x2"
              class="w-full max-w-xl object-contain"
            />
          </div>
        </div>

        <FormContact />
      </div>
    </section>
  </main>
</template>

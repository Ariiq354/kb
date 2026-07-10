<template>
  <section class="container flex flex-col items-center gap-10 lg:flex-row lg:gap-12">
    <div class="w-full text-center lg:w-1/2 lg:text-left">
      <h1 class="text-4xl font-bold leading-tight sm:text-5xl lg:leading-14">
        Selamat Datang di <br class="hidden sm:block"><span class="text-eastern-blue-500">Keluarga</span> Bahagia
      </h1>
      <p class="mx-auto mt-5 max-w-md text-base leading-relaxed sm:mt-6 sm:text-lg lg:mx-0 bg-white">
        Temukan perjalanan menuju keluarga yang harmonis melalui bimbingan, pembelajaran, dan dukungan untuk membangun hubungan yang penuh cinta, keberkahan, dan kebahagiaan.
      </p>
      <div class="flex flex-col justify-center gap-3 pt-8 sm:flex-row lg:justify-start">
        <UButton class="justify-center rounded-full px-8 py-4 text-sm">
          Daftar Sekarang
        </UButton>
        <UButton variant="soft" class="justify-center rounded-full px-8 py-4 text-sm">
          Lihat Layanan Kami
        </UButton>
      </div>
    </div>
    <div class="relative aspect-square w-full max-w-80 sm:max-w-110 lg:max-w-none lg:flex-1">
      <!-- Background Card -->
      <div
        class="absolute inset-0 bg-[#eadfd6] rounded-4xl rotate-3 shadow-sm"
      />

      <!-- Main Card -->
      <div
        class="absolute inset-0 bg-[#e9b78f] rounded-4xl shadow-xl p-8"
      >
        <!-- Inner Image Wrapper -->
        <div class="w-full h-full bg-[#f6e8d8] rounded-md overflow-hidden shadow-inner">
          <div class=" bg-amber-50 relative z-10 h-full shadow-sm flex items-center justify-center">
            <UIcon name="i-material-symbols-add-photo-alternate-outline" size="50" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<template>
  <section class="container flex items-center gap-12 mt-21">
    <div class="w-1/2 text-left">
      <h1 class="font-bold text-5xl leading-14">
        Selamat Datang di <br><span class="text-primary">Keluarga</span> Bahagia
      </h1>
      <p class="text-lg max-w-md mt-6">
        Temukan perjalanan menuju keluarga yang harmonis melalui bimbingan, pembelajaran, dan dukungan untuk membangun hubungan yang penuh cinta, keberkahan, dan kebahagiaan.
      </p>
      <div class="pt-8 flex gap-4 justify-start">
        <UButton class="rounded-full px-8 py-4 text-sm">
          Daftar Sekarang
        </UButton>
        <UButton variant="soft" class="rounded-full px-8 py-4 text-sm">
          Lihat Layanan Kami
        </UButton>
      </div>
    </div>
    <div class="relative w-150 h-150">
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

<template>
  <section class="container my-20">
    <div class="text-center max-w-2xl mx-auto space-y-4 mb-8">
      <h2 class="font-bold text-4xl">
        Layanan Kami
      </h2>

      <p class="font-body-md text-body-md text-on-surface-variant">
        Kami hadir untuk membantu perjalanan Anda dalam mempersiapkan pernikahan, membangun hubungan yang sehat, serta menemukan pasangan hidup yang sejalan dengan nilai dan tujuan kehidupan.
      </p>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <!-- Service 1: Bootcamp -->
      <div class="col-span-2 border border-mosque/20 rounded-2xl p-8 shadow-md relative">
        <div class="absolute top-0 right-0 p-8 opacity-10 text-primary">
          <UIcon name="i-material-symbols-favorite" size="100" />
        </div>

        <div class="flex flex-col justify-between">
          <span class="flex items-center justify-center w-12 h-12 rounded-full bg-mosque text-white mb-4">
            <UIcon name="i-material-symbols-group" size="24" />
          </span>

          <h3 class="font-semibold text-xl mb-2">
            Bootcamp
          </h3>

          <p class="max-w-md mb-4 text-gray-600 leading-relaxed">
            Program ini bertujuan untuk memberikan bekal pengetahuan dan keterampilan yang diperlukan dalam membangun kehidupan rumah tangga yang bahagia, harmonis, dan penuh keberkahan.
          </p>

          <UButton
            to="/bootcamp"
            variant="link"
            trailing-icon="i-material-symbols-arrow-forward"
            class="flex items-center w-fit p-0"
          >
            Cari Bootcamp
          </UButton>
        </div>
      </div>

      <!-- Service 2: Ebooks -->
      <div class="border border-mosque/20 rounded-2xl p-8 shadow-md relative">
        <div class="flex flex-col justify-between h-full">
          <span class="flex items-center justify-center w-12 h-12 rounded-full bg-mosque/20 text-mosque mb-4">
            <UIcon name="i-material-symbols-menu-book-outline" size="24" />
          </span>

          <h3 class="font-semibold text-xl mb-2">
            Ebooks & Panduan
          </h3>

          <p class="max-w-md mb-4 text-gray-600 leading-relaxed">
            Temukan berbagai ebook dan panduan inspiratif mengenai hubungan, komunikasi, persiapan pernikahan, serta tips membangun keluarga yang harmonis dan bertumbuh bersama.
          </p>

          <UButton
            to="/ebooks"
            variant="link"
            trailing-icon="i-material-symbols-arrow-forward"
            class="flex items-center w-fit p-0"
          >
            Jelajahi Ebook
          </UButton>
        </div>
      </div>

      <!-- Service 3: Jodoh -->
      <div class="col-span-3 rounded-2xl p-12 shadow-md relative bg-just-right/20">
        <div class="flex flex-row items-center justify-between gap-10 relative z-10">
          <div class="max-w-2xl space-y-5">
            <div class="space-y-3">
              <h3 class="font-semibold text-3xl">
                Jodoh
              </h3>

              <p class="text-gray-600 leading-relaxed">
                Banyak yang percaya bahwa jodoh adalah cerminan dari diri kita sendiri. Jodoh adalah perjalanan yang penuh dengan kejutan, pembelajaran, dan proses untuk menemukan pasangan terbaik dalam hidup.
              </p>
            </div>

            <UButton
              to="/login"
              class="rounded-full bg-mosque text-white hover:bg-mosque/80 px-6 py-3 text-sm"
            >
              Mulai Profil Anda
            </UButton>
          </div>

          <div class="w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
            <div class="rounded-2xl bg-amber-50 relative z-10 h-full shadow-sm flex items-center justify-center">
              <UIcon name="i-material-symbols-add-photo-alternate-outline" size="50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

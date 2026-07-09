<template>
  <section class="container my-14 md:my-20">
    <div class="mx-auto mb-8 max-w-2xl space-y-4 text-center">
      <h2 class="text-3xl font-bold sm:text-4xl">
        Layanan Kami
      </h2>

      <p class="text-base leading-relaxed text-muted sm:text-body-md">
        Kami hadir untuk membantu perjalanan Anda dalam mempersiapkan pernikahan, membangun hubungan yang sehat, serta menemukan pasangan hidup yang sejalan dengan nilai dan tujuan kehidupan.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <!-- Service 1: Bootcamp -->
      <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-white p-6 shadow-md sm:p-8 lg:col-span-2">
        <div class="absolute right-0 top-0 p-6 text-primary opacity-10 sm:p-8">
          <UIcon name="i-material-symbols-favorite" class="size-20 sm:size-[100px]" />
        </div>

        <div class="relative z-10 flex flex-col justify-between">
          <span class="mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-white">
            <UIcon name="i-material-symbols-group" class="size-6" />
          </span>

          <h3 class="mb-2 text-xl font-semibold">
            Bootcamp
          </h3>

          <p class="mb-4 max-w-md leading-relaxed text-muted">
            Program ini bertujuan untuk memberikan bekal pengetahuan dan keterampilan yang diperlukan dalam membangun kehidupan rumah tangga yang bahagia, harmonis, dan penuh keberkahan.
          </p>

          <UButton
            to="/products"
            variant="link"
            trailing-icon="i-material-symbols-arrow-forward"
            class="flex items-center w-fit p-0"
          >
            Cari Bootcamp
          </UButton>
        </div>
      </div>

      <!-- Service 2: Ebooks -->
      <div class="relative rounded-2xl border border-primary/20 bg-white p-6 shadow-md sm:p-8">
        <div class="flex h-full flex-col justify-between">
          <span class="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
            <UIcon name="i-material-symbols-menu-book-outline" class="size-6" />
          </span>

          <h3 class="mb-2 text-xl font-semibold">
            Ebooks & Panduan
          </h3>

          <p class="mb-4 max-w-md leading-relaxed text-muted">
            Temukan berbagai ebook dan panduan inspiratif mengenai hubungan, komunikasi, persiapan pernikahan, serta tips membangun keluarga yang harmonis dan bertumbuh bersama.
          </p>

          <UButton
            to="/products"
            variant="link"
            trailing-icon="i-material-symbols-arrow-forward"
            class="flex items-center w-fit p-0"
          >
            Jelajahi Ebook
          </UButton>
        </div>
      </div>

      <!-- Service 3: Jodoh -->
      <div class="relative rounded-2xl bg-[#fef7f2] p-6 shadow-md sm:p-8 lg:col-span-3 lg:p-12">
        <div class="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center lg:gap-10">
          <div class="order-last md:order-first max-w-2xl space-y-5">
            <div class="space-y-3">
              <h3 class="text-2xl font-semibold sm:text-3xl">
                Jodoh
              </h3>

              <p class="leading-relaxed text-muted">
                Banyak yang percaya bahwa jodoh adalah cerminan dari diri kita sendiri. Jodoh adalah perjalanan yang penuh dengan kejutan, pembelajaran, dan proses untuk menemukan pasangan terbaik dalam hidup.
              </p>
            </div>

            <UButton
              to="/login"
              class="rounded-full bg-primary text-white hover:bg-primary/80 px-6 py-3 text-sm"
            >
              Mulai Profil Anda
            </UButton>
          </div>

          <div class="flex justify-center w-full md:w-auto">
            <div class="size-36 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg sm:size-44 lg:size-52">
              <div class="relative z-10 flex h-full items-center justify-center rounded-2xl bg-amber-50 shadow-sm">
                <UIcon name="i-material-symbols-add-photo-alternate-outline" class="size-10 sm:size-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const mentors = [
  {
    name: "Coach Rino Amri",
    role: "Relationship Coach",
    description:
      "Membantu pasangan dan calon pasangan membangun hubungan yang sehat, dewasa, dan harmonis melalui komunikasi dan pemahaman yang lebih baik.",
  },
  {
    name: "Coach Isranto Miraji",
    role: "Family Development",
    description:
      "Berfokus pada pengembangan kualitas keluarga dan persiapan pernikahan untuk menciptakan rumah tangga yang kuat dan penuh keberkahan.",
  },
  {
    name: "Ustadz Andri Setiawan",
    role: "Pendidikan Pranikah",
    description:
      "Membimbing calon pasangan memahami pernikahan sebagai ibadah serta membangun fondasi keluarga sesuai nilai-nilai Islam.",
  },
  {
    name: "Ustadz Wiwid",
    role: "Konsultan Keluarga",
    description:
      "Memberikan pendampingan dan nasihat keluarga untuk memperkuat ikatan rumah tangga yang sakinah, mawaddah, dan rahmah.",
  },
];
</script>

<template>
  <main class="bg-[url('/images/tentangbg1.webp')] bg-auto md:bg-contain md:bg-center pt-12 md:pt-20 lg:pt-32">
    <div class="container mx-auto space-y-16 md:space-y-24 lg:space-y-28">
      <!-- HERO / ABOUT -->
      <section class="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <!-- Left -->
        <div class="text-center lg:text-left">
          <span
            class="inline-flex rounded-full bg-eastern-blue-100 px-4 py-1 text-sm font-medium text-eastern-blue-600"
          >
            Tentang Kami
          </span>

          <h1 class="mt-5 text-3xl font-bold leading-tight text-default sm:text-4xl lg:mt-6 lg:text-5xl">
            Membangun keluarga harmonis untuk
            <span class="text-eastern-blue-500">
              Indonesia Emas 2045
            </span>
          </h1>

          <div class="mx-auto mt-5 max-w-2xl space-y-4 text-base leading-7 text-muted sm:text-lg sm:leading-8 lg:mx-0 lg:mt-6 bg-white">
            <p>
              Keluarga Bahagia adalah platform pendidikan pranikah dan penguatan
              keluarga yang dirancang untuk membantu individu menemukan pasangan
              hidup dengan visi, nilai, dan tujuan yang sejalan.
            </p>

            <p>
              Kami hadir sebagai solusi modern untuk mendukung terbentuknya
              keluarga yang berkualitas, berdaya saing, dan berwawasan luas,
              sekaligus berkontribusi dalam mewujudkan Indonesia Emas 2045.
            </p>

            <p>
              Kami percaya bahwa keluarga adalah fondasi penting dalam kehidupan.
              Karena itu, kami berkomitmen membantu setiap individu memahami
              esensi pernikahan sebagai ibadah, mempersiapkan diri menjadi
              pasangan terbaik, dan membangun rumah tangga yang penuh cinta,
              keberkahan, dan makna.
            </p>
          </div>
        </div>

        <!-- Right -->
        <div class="relative mx-auto w-full max-w-md lg:max-w-none">
          <!-- background layer -->
          <div class="absolute inset-0 rotate-3 rounded-3xl bg-eastern-blue-100" />

          <!-- main card -->
          <div
            class="relative overflow-hidden rounded-3xl bg-eastern-blue-200 p-4 shadow-xl sm:p-6"
          >
            <div
              class="flex aspect-4/3 items-center justify-center rounded-2xl bg-eastern-blue-50"
            >
              <UIcon
                name="i-material-symbols-favorite-rounded"
                class="size-14 text-eastern-blue-400 sm:size-18"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- MENTORS -->
      <section class="">
        <!-- Header -->
        <div class="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <h2 class="text-3xl font-bold text-default sm:text-4xl">
            Mentor Kami
          </h2>

          <p class="mt-4 text-base leading-relaxed text-muted">
            Dipandu oleh mentor dan pembimbing berpengalaman untuk membantu
            perjalanan membangun keluarga yang harmonis dan penuh keberkahan.
          </p>
        </div>

        <!-- Grid -->
        <div class="grid gap-5 pb-16 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:pb-32">
          <!-- Mentor -->
          <div
            v-for="mentor in mentors"
            :key="mentor.name"
            class="rounded-3xl border border-eastern-blue-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <!-- Placeholder -->
            <div
              class="mx-auto flex size-20 items-center justify-center rounded-full bg-eastern-blue-100 sm:size-24"
            >
              <UIcon
                name="i-material-symbols-person-rounded"
                class="size-10 text-eastern-blue-400"
              />
            </div>

            <h3 class="mt-4 text-lg font-semibold text-default sm:text-xl">
              {{ mentor.name }}
            </h3>

            <p class="text-sm font-medium text-eastern-blue-500">
              {{ mentor.role }}
            </p>

            <p class="mt-4 text-sm leading-6 text-muted">
              {{ mentor.description }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

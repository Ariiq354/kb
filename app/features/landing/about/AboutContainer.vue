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
  <main class="bg-[url('/images/tentangbg1.webp')] bg-contain pt-32">
    <div class="container mx-auto space-y-28 px-6">
      <!-- HERO / ABOUT -->
      <section class="grid items-center gap-12 lg:grid-cols-2">
        <!-- Left -->
        <div>
          <span
            class="inline-flex rounded-full bg-eastern-blue-100 px-4 py-1 text-sm font-medium text-eastern-blue-600"
          >
            Tentang Kami
          </span>

          <h1 class="mt-6 text-5xl font-bold leading-tight text-gray-900">
            Membangun keluarga harmonis untuk
            <span class="text-eastern-blue-500">
              Indonesia Emas 2045
            </span>
          </h1>

          <div class="mt-6 space-y-5 text-lg leading-8 text-gray-600">
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
        <div class="relative">
          <!-- background layer -->
          <div class="absolute inset-0 rotate-3 rounded-3xl bg-eastern-blue-100" />

          <!-- main card -->
          <div
            class="relative overflow-hidden rounded-3xl bg-eastern-blue-200 p-6 shadow-xl"
          >
            <div
              class="flex aspect-4/3 items-center justify-center rounded-2xl bg-eastern-blue-50"
            >
              <UIcon
                name="i-material-symbols-favorite-rounded"
                size="72"
                class="text-eastern-blue-400"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- MENTORS -->
      <section class="">
        <!-- Header -->
        <div class="mx-auto mb-14 max-w-2xl text-center">
          <h2 class="text-4xl font-bold text-gray-900">
            Mentor Kami
          </h2>

          <p class="mt-4 text-gray-600">
            Dipandu oleh mentor dan pembimbing berpengalaman untuk membantu
            perjalanan membangun keluarga yang harmonis dan penuh keberkahan.
          </p>
        </div>

        <!-- Grid -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pb-32">
          <!-- Mentor -->
          <div
            v-for="mentor in mentors"
            :key="mentor.name"
            class="rounded-3xl border border-eastern-blue-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <!-- Placeholder -->
            <div
              class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-eastern-blue-100"
            >
              <UIcon
                name="i-material-symbols-person-rounded"
                size="42"
                class="text-eastern-blue-400"
              />
            </div>

            <h3 class="mt-4 text-xl font-semibold text-gray-900">
              {{ mentor.name }}
            </h3>

            <p class="text-sm font-medium text-eastern-blue-500">
              {{ mentor.role }}
            </p>

            <p class="mt-4 text-sm leading-6 text-gray-600">
              {{ mentor.description }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

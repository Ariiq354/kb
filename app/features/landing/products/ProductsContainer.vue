<script setup lang="ts">
import Bootcamps from "./components/Bootcamps.vue";
import Courses from "./components/Courses.vue";
import Ebooks from "./components/Ebooks.vue";
</script>

<template>
  <main class="bg-[url('/images/tentangbg1.webp')] bg-contain">
    <div class="container bg-default px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-20 xl:px-20">
      <div class="mb-10 sm:mb-14 lg:mb-20">
        <h1 class="text-3xl leading-tight font-bold text-primary sm:text-4xl">
          Program & Materi Unggulan Kami
        </h1>
        <p class="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
          Temukan pelatihan intensif yang dipandu oleh para ahli dan panduan komprehensif yang dirancang untuk memelihara hubungan Anda dan membangun ikatan yang langgeng.
        </p>
      </div>
      <Bootcamps />
      <div class="my-12 sm:my-16 lg:my-20">
        <Courses />
      </div>
      <Ebooks />
    </div>
  </main>
</template>

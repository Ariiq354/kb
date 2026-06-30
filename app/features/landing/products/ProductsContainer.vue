<script setup lang="ts">
import Bootcamps from "./components/Bootcamps.vue";
import Courses from "./components/Courses.vue";
import Ebooks from "./components/Ebooks.vue";
</script>

<template>
  <div class="container">
    <div class="mb-20">
      <h1 class="text-primary-600 text-4xl font-bold">
        Program & Materi Unggulan Kami
      </h1>
      <p class="max-w-3xl mt-2">
        Temukan pelatihan intensif yang dipandu oleh para ahli dan panduan komprehensif yang dirancang untuk memelihara hubungan Anda dan membangun ikatan yang langgeng.
      </p>
    </div>
    <Bootcamps />
    <div class="my-20">
      <Courses />
    </div>
    <Ebooks />
  </div>
</template>

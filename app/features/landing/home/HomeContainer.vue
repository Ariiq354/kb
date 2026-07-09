<script setup lang="ts">
import Hero from "./components/Hero.vue";
import Layanan from "./components/Layanan.vue";
import Quote from "./components/Quote.vue";
import Seminar from "./components/Seminar.vue";
</script>

<template>
  <main>
    <div class="bg-[url('/images/landingbg1.webp')] object-cover bg-center pt-20">
      <Hero />
      <Layanan />
    </div>
    <Seminar />
    <Quote />
  </main>
</template>

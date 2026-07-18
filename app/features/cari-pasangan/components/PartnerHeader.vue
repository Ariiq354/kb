<script setup lang="ts">
defineProps<{
  total: number;
}>();
</script>

<template>
  <div class="bg-linear-to-r from-primary-500 to-pink-500 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
    <div class="space-y-1 text-center md:text-left">
      <h2 class="text-2xl font-black">
        Cari Calon Pasangan Ta'aruf
      </h2>
      <p class="text-sm text-white/90">
        Temukan calon pasangan hidup yang sejalan dalam visi pernikahan syar'i.
      </p>
    </div>
    <div class="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/20 text-center shrink-0">
      <div class="text-xs font-semibold text-white/80 uppercase tracking-wider">
        Total Rekomendasi
      </div>
      <div class="text-2xl font-black">
        {{ total }} Anggota
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UBadge, UCard, UIcon } from "#components";

interface StatsProps {
  stats: {
    totalCourses: number;
    taarufStatusLabel: string;
    taarufStatusBadge: "neutral" | "warning" | "success" | "info" | "error" | "primary";
    totalOrders: number;
    profileCompleteness: number;
  };
}

defineProps<StatsProps>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Course/Belajar -->
    <div class="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 border border-emerald-500/10 dark:border-emerald-500/20 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
      <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kelas & Bootcamp</span>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <UIcon name="i-lucide-book-open" class="w-5 h-5" />
        </div>
      </div>
      <div class="mt-3">
        <div class="text-2xl font-bold text-slate-900 dark:text-white">
          {{ stats.totalCourses }}
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Modul kelas aktif berjalan
        </p>
      </div>
    </div>

    <!-- Card 2: Status Ta'aruf -->
    <div class="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 border border-rose-500/10 dark:border-rose-500/20 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
      <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status Ta'aruf</span>
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <UIcon name="i-lucide-heart" class="w-5 h-5" />
        </div>
      </div>
      <div class="mt-3">
        <div class="text-lg font-bold text-slate-900 dark:text-white truncate">
          {{ stats.taarufStatusLabel }}
        </div>
        <div class="mt-1">
          <UBadge :color="stats.taarufStatusBadge" variant="soft" size="xs">
            Proses Aktif
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Card 3: Total Order -->
    <div class="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 border border-sky-500/10 dark:border-sky-500/20 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
      <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Transaksi</span>
        <div class="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
          <UIcon name="i-lucide-shopping-bag" class="w-5 h-5" />
        </div>
      </div>
      <div class="mt-3">
        <div class="text-2xl font-bold text-slate-900 dark:text-white">
          {{ stats.totalOrders }}
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Produk terverifikasi
        </p>
      </div>
    </div>

    <!-- Card 4: Kelengkapan Profil -->
    <div class="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 p-5 border border-amber-500/10 dark:border-amber-500/20 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
      <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kelengkapan Profil</span>
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <UIcon name="i-lucide-user-check" class="w-5 h-5" />
        </div>
      </div>
      <div class="mt-3">
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.profileCompleteness }}</span>
          <span class="text-sm font-semibold text-slate-500 dark:text-slate-400">%</span>
        </div>
        <div class="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            class="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            :style="{ width: `${stats.profileCompleteness}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

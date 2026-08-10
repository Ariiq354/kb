<script setup lang="ts">
import { AreaChart, CurveType } from "vue-chrts";
import { UIcon } from "#components";

interface LearningChartProps {
  data: Array<{
    completedLessons: number;
    studyHours: number;
  }>;
}

const props = defineProps<LearningChartProps>();

const categories = {
  studyHours: {
    name: "Jam Belajar (Jam)",
    color: "#10b981", // Emerald 500
  },
  completedLessons: {
    name: "Materi Selesai",
    color: "#0284c7", // Sky 600
  },
};
</script>

<template>
  <div class="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm h-full">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-emerald-500" />
          Aktivitas &amp; Progres Belajar
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Statistik waktu belajar &amp; penyelesaian materi 6 bulan terakhir
        </p>
      </div>

      <div class="hidden sm:flex items-center gap-4 text-xs font-medium">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span class="text-slate-600 dark:text-slate-300">Jam Belajar</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-sky-600 inline-block" />
          <span class="text-slate-600 dark:text-slate-300">Materi Selesai</span>
        </div>
      </div>
    </div>

    <!-- Nuxt Chart: AreaChart -->
    <div class="w-full">
      <AreaChart
        :data="props.data"
        :categories="categories"
        :height="250"
        :show-grid-lines="true"
        :curve-type="CurveType.MonotoneX"
      />
    </div>
  </div>
</template>

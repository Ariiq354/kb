<script setup lang="ts">
import { UButton, UIcon, UProgress } from "#components";

interface RecentCourse {
  id: number;
  title: string;
  thumbnail: string | null;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
}

interface RecentCoursesProps {
  courses: RecentCourse[];
}

defineProps<RecentCoursesProps>();
</script>

<template>
  <div class="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <UIcon name="i-lucide-play-circle" class="w-5 h-5 text-emerald-500" />
        Kursus Sedang Dipelajari
      </h3>
      <NuxtLink to="/user/produk" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
        Lihat Semua
      </NuxtLink>
    </div>

    <div class="space-y-4">
      <div
        v-for="course in courses"
        :key="course.id"
        class="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-200"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-video" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                {{ course.title }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ course.completedLessons }} dari {{ course.totalLessons }} Materi Selesai
              </p>
            </div>
          </div>

          <NuxtLink :to="`/kelas/${course.id}`" class="shrink-0">
            <UButton
              color="primary"
              variant="soft"
              size="xs"
              icon="i-lucide-play"
              trailing
            >
              Lanjutkan
            </UButton>
          </NuxtLink>
        </div>

        <!-- Nuxt UI Progress Bar -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Progres Pembelajaran</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ course.progressPercent }}%</span>
          </div>
          <UProgress :model-value="course.progressPercent" color="primary" size="xs" />
        </div>
      </div>
    </div>
  </div>
</template>

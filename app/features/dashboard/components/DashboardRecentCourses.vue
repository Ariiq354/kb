<script setup lang="ts">
import { UButton, UIcon, UProgress } from "#components";

interface CourseItem {
  id: number;
  title: string;
  thumbnail: string | null;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
}

interface Props {
  courses: CourseItem[];
}

defineProps<Props>();
</script>

<template>
  <div class="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <UIcon name="i-lucide-play-circle" class="w-5 h-5 text-emerald-500" />
        Kelas Yang Sedang Diikuti
      </h3>
      <NuxtLink to="/dashboard/user/kursus">
        <UButton color="neutral" variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right">
          Lihat Semua
        </UButton>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="!courses || courses.length === 0" class="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
      <UIcon name="i-lucide-book-open" class="w-8 h-8 text-slate-400 mx-auto" />
      <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Belum ada kelas yang sedang diikuti.
      </p>
      <NuxtLink to="/kursus">
        <UButton color="primary" variant="soft" size="xs" class="mt-1">
          Jelajahi Katalog Kelas
        </UButton>
      </NuxtLink>
    </div>

    <!-- Course List -->
    <div v-else class="space-y-3">
      <div
        v-for="course in courses"
        :key="course.id"
        class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-colors space-y-3"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-book-open" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {{ course.title }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ course.completedLessons }} dari {{ course.totalLessons }} Materi Selesai
              </p>
            </div>
          </div>
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {{ course.progressPercent }}%
          </span>
        </div>

        <UProgress :model-value="course.progressPercent" color="success" size="sm" />
      </div>
    </div>
  </div>
</template>

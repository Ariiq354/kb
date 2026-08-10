<script setup lang="ts">
import { USkeleton } from "#components";
</script>

<template>
  <div class="space-y-6">
    <!-- Header Skeleton -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
      <div class="flex items-center gap-4">
        <USkeleton class="w-14 h-14 rounded-full" />
        <div class="space-y-2">
          <USkeleton class="h-6 w-48" />
          <USkeleton class="h-4 w-32" />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <USkeleton class="h-10 w-36 rounded-xl" />
        <USkeleton class="h-10 w-36 rounded-xl" />
      </div>
    </div>

    <!-- 4 KPI Stat Cards Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-3">
        <div class="flex items-center justify-between">
          <USkeleton class="h-4 w-24" />
          <USkeleton class="w-10 h-10 rounded-xl" />
        </div>
        <USkeleton class="h-8 w-20" />
        <USkeleton class="h-3 w-32" />
      </div>
    </div>

    <!-- Main Grid: Charts & Widgets Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Activity Chart & Recent Courses (2 cols) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Area Chart Card Skeleton -->
        <div class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-4">
          <div class="flex items-center justify-between">
            <USkeleton class="h-6 w-40" />
            <USkeleton class="h-4 w-24" />
          </div>
          <USkeleton class="h-64 w-full rounded-xl" />
        </div>

        <!-- Recent Courses List Skeleton -->
        <div class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-4">
          <USkeleton class="h-6 w-44" />
          <div v-for="j in 2" :key="j" class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <USkeleton class="h-5 w-60" />
              <USkeleton class="h-4 w-12" />
            </div>
            <USkeleton class="h-2 w-full rounded-full" />
          </div>
        </div>
      </div>

      <!-- Right Column: Distribution & Taaruf Widget (1 col) -->
      <div class="space-y-6">
        <!-- Donut Chart Skeleton -->
        <div class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-4">
          <USkeleton class="h-6 w-44" />
          <USkeleton class="h-48 w-48 mx-auto rounded-full" />
        </div>

        <!-- Taaruf Widget Skeleton -->
        <div class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-4">
          <USkeleton class="h-6 w-36" />
          <USkeleton class="h-20 w-full rounded-xl" />
          <USkeleton class="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
</template>

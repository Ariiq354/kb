<script setup lang="ts">
import { UAvatar, UButton, UIcon } from "#components";
import { useLazyFetch } from "#imports";
import type { DashboardData } from "~~/server/modules/dashboard/service";
import DashboardDistributionChart from "./components/DashboardDistributionChart.vue";
import DashboardLearningChart from "./components/DashboardLearningChart.vue";
import DashboardRecentCourses from "./components/DashboardRecentCourses.vue";
import DashboardSkeleton from "./components/DashboardSkeleton.vue";
import DashboardStatsCards from "./components/DashboardStatsCards.vue";
import DashboardTaarufWidget from "./components/DashboardTaarufWidget.vue";

const { data: dashboard, pending, error, refresh } = useLazyFetch<DashboardData>("/api/v1/dashboard");
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Skeleton Loading State -->
    <DashboardSkeleton v-if="pending" />

    <!-- Error State -->
    <div v-else-if="error" class="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-center space-y-4">
      <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <UIcon name="i-lucide-alert-circle" class="w-6 h-6" />
      </div>
      <div>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">
          Gagal Memuat Ringkasan Aktivitas
        </h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {{ error.statusMessage || error.message || 'Terjadi kesalahan saat mengunduh data dashboard.' }}
        </p>
      </div>
      <UButton
        color="error"
        variant="soft"
        icon="i-lucide-refresh-cw"
        size="sm"
        @click="refresh()"
      >
        Coba Lagi
      </UButton>
    </div>

    <!-- Loaded Dashboard Content -->
    <div v-else-if="dashboard" class="space-y-8 animate-fade-in">
      <!-- Top Welcome Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 md:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div class="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <UAvatar
              :src="dashboard.user.image || undefined"
              :alt="dashboard.user.name"
              size="lg"
              class="ring-4 ring-white/30 shadow-md"
            />
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-black tracking-tight">
                  Assalamu'alaikum, {{ dashboard.user.name }}!
                </h1>
                <span class="inline-block animate-bounce">👋</span>
              </div>
              <p class="text-xs md:text-sm text-emerald-100 mt-1">
                Selamat datang di Ringkasan Aktivitas platform Keluarga Bahagia Anda.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <NuxtLink to="/user/profil">
              <UButton
                color="neutral"
                variant="solid"
                icon="i-lucide-user"
                size="sm"
                class="!text-emerald-800 font-semibold shadow-sm hover:bg-emerald-50"
              >
                Lengkapi Profil
              </UButton>
            </NuxtLink>
            <NuxtLink to="/taaruf">
              <UButton
                color="primary"
                variant="soft"
                icon="i-lucide-heart"
                size="sm"
                class="!bg-white/20 !text-white hover:!bg-white/30 border border-white/20"
              >
                Area Ta'aruf
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 4 KPI Stat Cards -->
      <DashboardStatsCards :stats="dashboard.stats" />

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Activity Chart & Recent Courses (2 Cols) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Learning Activity Area Chart -->
          <DashboardLearningChart :data="dashboard.charts.learningActivity" />

          <!-- Recent Active Courses -->
          <DashboardRecentCourses :courses="dashboard.learning.recentCourses" />
        </div>

        <!-- Right Column: Portfolio Distribution & Taaruf Widget (1 Col) -->
        <div class="space-y-8">
          <!-- Portfolio Distribution Donut Chart -->
          <DashboardDistributionChart :distribution="dashboard.charts.portfolioDistribution" />

          <!-- Ta'aruf & Bootcamp Lokasi Widget -->
          <DashboardTaarufWidget
            :taaruf="dashboard.taaruf"
            :upcoming-bootcamp="dashboard.learning.upcomingBootcamp"
          />
        </div>
      </div>
    </div>
  </div>
</template>

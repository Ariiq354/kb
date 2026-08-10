<script setup lang="ts">
import { UAvatar, UButton } from "#components";
import { useAuthSession } from "~/composables/auth";
import DashboardDistributionChart from "./components/DashboardDistributionChart.vue";
import DashboardLearningChart from "./components/DashboardLearningChart.vue";
import DashboardSkeleton from "./components/DashboardSkeleton.vue";
import DashboardStatsCards from "./components/DashboardStatsCards.vue";

const { data: dashboard, pending } = useLazyFetch("/api/v1/dashboard");
const { session } = await useAuthSession();
</script>

<template>
  <div class="space-y-8">
    <!-- Skeleton Loading State -->
    <DashboardSkeleton v-if="pending" />

    <!-- Loaded Dashboard Content -->
    <div v-else-if="dashboard" class="space-y-8 animate-fade-in">
      <!-- Top Welcome Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 md:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div class="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <UAvatar
              :src="session?.user.image || undefined"
              :alt="session?.user.name"
              size="lg"
              class="ring-4 ring-white/30 shadow-md"
            />
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-black tracking-tight">
                  Assalamu'alaikum, {{ session?.user.name }}!
                </h1>
                <span class="inline-block animate-bounce">👋</span>
              </div>
              <p class="text-xs md:text-sm text-emerald-100 mt-1">
                Selamat datang di Ringkasan Aktivitas platform Keluarga Bahagia Anda.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <NuxtLink to="/dashboard/user/profile">
              <UButton
                color="neutral"
                variant="solid"
                icon="i-lucide-user"
                size="sm"
              >
                Lengkapi Profil
              </UButton>
            </NuxtLink>
            <NuxtLink to="/dashboard/user/taaruf">
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-heart"
                size="sm"
              >
                Area Ta'aruf
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 4 KPI Stat Cards -->
      <DashboardStatsCards :stats="dashboard.stats" />

      <!-- Main Dashboard Layout (Rows) -->
      <div class="space-y-8">
        <!-- Row 1: Charts (Learning Activity & Portfolio Distribution) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2">
            <DashboardLearningChart :data="dashboard.charts.learningActivity" />
          </div>
          <div class="lg:col-span-1">
            <DashboardDistributionChart :distribution="dashboard.charts.portfolioDistribution" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

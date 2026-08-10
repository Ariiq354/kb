<script setup lang="ts">
import { UAvatar, UBadge, UButton, UIcon } from "#components";

interface TaarufWidgetProps {
  taaruf: {
    hasActiveProcess: boolean;
    processId: number | null;
    status: string | null;
    partnerName: string | null;
    partnerKode: string | null;
    partnerImage: string | null;
    partnerKota: string | null;
    lastLogMessage: string | null;
  };
  upcomingBootcamp: {
    id: number;
    title: string;
    tipe: string;
    waktu: string | null;
    lokasiName: string | null;
    googleMapLink: string | null;
    meetingLink: string | null;
  } | null;
}

defineProps<TaarufWidgetProps>();
</script>

<template>
  <div class="space-y-6">
    <!-- Ta'aruf Status Card -->
    <div class="rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-950/40 dark:via-rose-900/10 dark:to-slate-900/80 p-6 border border-rose-500/20 backdrop-blur-md shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-heart-handshake" class="w-5 h-5 text-rose-500" />
          Program Ta'aruf KB
        </h3>
        <UBadge v-if="taaruf.hasActiveProcess" color="error" variant="soft" size="xs">
          Aktif
        </UBadge>
        <UBadge v-else color="neutral" variant="soft" size="xs">
          Siap Mengajukan
        </UBadge>
      </div>

      <!-- Active Partner View -->
      <div v-if="taaruf.hasActiveProcess" class="p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-rose-200/60 dark:border-rose-900/40 space-y-3">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="taaruf.partnerImage || undefined"
            :alt="taaruf.partnerName || 'Pasangan'"
            size="md"
            class="ring-2 ring-rose-500/30"
          />
          <div>
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ taaruf.partnerName }}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Kode User: <span class="font-mono text-rose-600 dark:text-rose-400 font-bold">{{ taaruf.partnerKode }}</span> · {{ taaruf.partnerKota }}
            </p>
          </div>
        </div>
        <p v-if="taaruf.lastLogMessage" class="text-xs text-slate-600 dark:text-slate-300 bg-rose-50/80 dark:bg-rose-950/50 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/30">
          {{ taaruf.lastLogMessage }}
        </p>
      </div>

      <!-- Inactive View -->
      <div v-else class="text-center py-4 space-y-2">
        <p class="text-xs text-slate-600 dark:text-slate-400">
          Temukan calon pasangan yang selaras dengan kriteria syari Anda.
        </p>
      </div>

      <div class="mt-4">
        <NuxtLink to="/taaruf">
          <UButton
            block
            color="error"
            variant="soft"
            icon="i-lucide-arrow-right"
            trailing
            size="sm"
          >
            {{ taaruf.hasActiveProcess ? 'Lihat Detail Ta\'aruf' : 'Jelajahi Anggota Ta\'aruf' }}
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Upcoming Bootcamp & Lokasi Card -->
    <div v-if="upcomingBootcamp" class="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-emerald-500" />
          Agenda &amp; Lokasi Bootcamp
        </h3>
        <UBadge color="primary" variant="subtle" size="xs">
          {{ upcomingBootcamp.tipe }}
        </UBadge>
      </div>

      <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
        {{ upcomingBootcamp.title }}
      </h4>

      <div class="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
        <div class="flex items-start gap-2">
          <UIcon name="i-lucide-building-2" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span><strong class="text-slate-700 dark:text-slate-200">Lokasi:</strong> {{ upcomingBootcamp.lokasiName || 'Online / Zoom Meeting' }}</span>
        </div>
        <div v-if="upcomingBootcamp.waktu" class="flex items-center gap-2">
          <UIcon name="i-lucide-calendar" class="w-4 h-4 text-slate-400 shrink-0" />
          <span>{{ upcomingBootcamp.waktu }}</span>
        </div>
      </div>

      <div v-if="upcomingBootcamp.googleMapLink" class="mt-4">
        <a
          :href="upcomingBootcamp.googleMapLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <UIcon name="i-lucide-external-link" class="w-3.5 h-3.5" />
          Buka Peta Lokasi
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UAvatar, UBadge, UButton, UIcon } from "#components";

interface TaarufItem {
  id: number;
  status: string;
  otherUser: {
    id: number;
    name: string;
    image: string | null;
    kodeUser: string | null;
    gender: string | null;
    kotaNama: string | null;
  };
}

interface BootcampItem {
  id: number;
  title: string;
  tipe: string;
  waktu: string | null;
  lokasiName: string | null;
  googleMapLink: string | null;
  meetingLink: string | null;
}

interface Props {
  taaruf: TaarufItem | null;
  upcomingBootcamp: BootcampItem | null;
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-6">
    <!-- Ta'aruf Card -->
    <div class="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-heart" class="w-5 h-5 text-rose-500" />
          Status Ta'aruf Aktif
        </h3>
        <NuxtLink to="/dashboard/user/taaruf">
          <UButton color="neutral" variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right">
            Detail
          </UButton>
        </NuxtLink>
      </div>

      <div v-if="!taaruf" class="p-5 text-center rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-dashed border-rose-200 dark:border-rose-900/40 space-y-2">
        <UIcon name="i-lucide-users" class="w-8 h-8 text-rose-400 mx-auto" />
        <p class="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Belum ada proses ta'aruf yang aktif saat ini.
        </p>
        <NuxtLink to="/dashboard/user/taaruf">
          <UButton color="error" variant="soft" size="xs" class="mt-1">
            Cari Pasangan
          </UButton>
        </NuxtLink>
      </div>

      <div v-else class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="taaruf.otherUser.image || undefined"
            :alt="taaruf.otherUser.name"
            size="md"
            class="ring-2 ring-rose-500/20"
          />
          <div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">
              {{ taaruf.otherUser.kodeUser || taaruf.otherUser.name }}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5 text-rose-500" />
              {{ taaruf.otherUser.kotaNama || 'Indonesia' }}
            </p>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <span class="text-xs text-slate-500 dark:text-slate-400">Status Proses:</span>
          <UBadge color="info" variant="soft" size="xs">
            {{ taaruf.status }}
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Upcoming Bootcamp Card -->
    <div class="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-calendar" class="w-5 h-5 text-amber-500" />
          Agenda Bootcamp
        </h3>
      </div>

      <div v-if="!upcomingBootcamp" class="p-5 text-center rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-dashed border-amber-200 dark:border-amber-900/40 space-y-2">
        <UIcon name="i-lucide-calendar-off" class="w-8 h-8 text-amber-400 mx-auto" />
        <p class="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Belum terdaftar di agenda bootcamp mendatang.
        </p>
        <NuxtLink to="/bootcamp">
          <UButton color="warning" variant="soft" size="xs" class="mt-1">
            Lihat Bootcamp
          </UButton>
        </NuxtLink>
      </div>

      <div v-else class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
        <div class="flex items-start justify-between gap-2">
          <h4 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
            {{ upcomingBootcamp.title }}
          </h4>
          <UBadge color="warning" variant="solid" size="xs" class="shrink-0">
            {{ upcomingBootcamp.tipe }}
          </UBadge>
        </div>

        <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div v-if="upcomingBootcamp.waktu" class="flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="w-4 h-4 text-amber-500 shrink-0" />
            <span>{{ upcomingBootcamp.waktu }}</span>
          </div>
          <div v-if="upcomingBootcamp.lokasiName" class="flex items-start gap-2">
            <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span class="line-clamp-1">{{ upcomingBootcamp.lokasiName }}</span>
          </div>
        </div>

        <div v-if="upcomingBootcamp.googleMapLink || upcomingBootcamp.meetingLink" class="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
          <a
            v-if="upcomingBootcamp.googleMapLink"
            :href="upcomingBootcamp.googleMapLink"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
          >
            <UIcon name="i-lucide-external-link" class="w-3.5 h-3.5" />
            Lokasi Peta
          </a>
          <a
            v-if="upcomingBootcamp.meetingLink"
            :href="upcomingBootcamp.meetingLink"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
          >
            <UIcon name="i-lucide-video" class="w-3.5 h-3.5" />
            Link Zoom
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

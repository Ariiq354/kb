<script setup lang="ts">
import { computed } from "vue";
import { useFetch, useRoute, useRuntimeConfig } from "#imports";

const route = useRoute();
const config = useRuntimeConfig();

const { data: item, status } = await useFetch<any>(() => `/api/v1/produk/${route.params.id}`, {
  ignoreResponseError: true,
});

const imageUrl = computed(() => {
  if (!item.value?.foto)
    return "/images/bootcamp-dummy.webp";
  if (item.value.foto.startsWith("http") || item.value.foto.startsWith("/")) {
    return item.value.foto;
  }
  return `${config.public.imageUrl}/${item.value.foto}`;
});

const isBootcampExpired = computed(() => {
  if (!item.value?.waktu)
    return false;

  const waktuStr = String(item.value.waktu).trim();

  // Direct Date parse (e.g. YYYY-MM-DD or ISO string)
  const directDate = new Date(waktuStr);
  if (!isNaN(directDate.getTime())) {
    // Compare with end of day
    directDate.setHours(23, 59, 59, 999);
    return directDate.getTime() < Date.now();
  }

  // Parse Indonesian Month Names (e.g. "15 Agustus 2024")
  const monthMap: Record<string, number> = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11,
  };

  const [t0, t1, t2] = waktuStr.toLowerCase().split(/\s+/);
  if (t0 && t1 && t2) {
    const day = Number.parseInt(t0, 10);
    const month = monthMap[t1];
    const year = Number.parseInt(t2, 10);

    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      const parsedDate = new Date(year, month, day, 23, 59, 59);
      return parsedDate.getTime() < Date.now();
    }
  }

  return false;
});
</script>

<template>
  <div class="py-4 px-2 sm:px-4">
    <div v-if="status === 'pending'" class="py-8 flex justify-center">
      <USkeleton class="h-96 w-full max-w-4xl rounded-xl" />
    </div>

    <div v-else-if="!item" class="py-12 text-center text-muted">
      Bootcamp tidak ditemukan.
    </div>

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
      <!-- Main Product Details -->
      <div class="lg:col-span-3 space-y-6">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm md:p-8 space-y-5">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <UBadge
                icon="i-lucide-graduation-cap"
                color="primary"
                variant="subtle"
              >
                Bootcamp
              </UBadge>
              <UBadge
                v-if="isBootcampExpired"
                color="neutral"
                variant="subtle"
                icon="i-lucide-calendar-x"
              >
                Bootcamp Telah Terlaksana
              </UBadge>
              <UBadge
                v-else
                color="success"
                variant="subtle"
                icon="i-lucide-check-circle"
              >
                Terverifikasi / Akses Aktif
              </UBadge>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {{ item.judul }}
            </h1>
          </div>

          <!-- Metadata Section -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div v-if="item.pembicara" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Pembicara: {{ item.pembicara }}</span>
            </div>
            <div v-if="item.waktu" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-calendar" class="text-primary" />
              <span>Waktu: {{ item.waktu }}</span>
            </div>
            <div v-if="item.tempat" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-map-pin" class="text-primary" />
              <span>Lokasi: {{ item.tempat }}</span>
            </div>
            <div v-if="item.tipe" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-laptop" class="text-primary" />
              <span>Tipe: {{ item.tipe }}</span>
            </div>
          </div>

          <!-- Description Section -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
              Deskripsi Bootcamp
            </h3>
            <div
              class="prose prose-base max-w-none dark:prose-invert leading-relaxed text-gray-700 dark:text-gray-300"
              v-html="item.deskripsi || 'Belum ada deskripsi.'"
            />
          </div>
        </div>
      </div>

      <!-- Access Links & Sidebar -->
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm md:p-6 space-y-5">
          <NuxtImg
            :src="imageUrl"
            class="w-full rounded-xl object-cover aspect-video shadow-xs"
          />

          <!-- Access Link Section for Bootcamp -->
          <div class="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-link" class="text-primary" />
              Akses & Link Bootcamp
            </h3>

            <!-- If Expired: Show Expired Notice without links -->
            <div v-if="isBootcampExpired" class="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 text-center space-y-2">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 mb-1">
                <UIcon name="i-lucide-calendar-x" size="24" />
              </div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                Bootcamp Telah Selesai Terlaksana
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Jadwal pelaksanaan bootcamp ini telah berlalu ({{ item.waktu }}). Sesi live meeting dan akses link lokasi sudah berakhir.
              </p>
            </div>

            <!-- If Active (Not Expired): Show Meeting and Location Links -->
            <template v-else>
              <!-- Meeting Link (Zoom / Google Meet) -->
              <div v-if="item.meetingLink" class="rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/50 p-4 space-y-2">
                <div class="flex items-center gap-2 text-xs font-semibold text-primary-900 dark:text-primary-200">
                  <UIcon name="i-lucide-video" class="text-base text-primary" />
                  <span>Link Meeting Kelas Online</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-300">
                  Silakan klik tombol di bawah untuk bergabung ke ruang pertemuan online.
                </p>
                <UButton
                  :to="item.meetingLink"
                  target="_blank"
                  color="primary"
                  block
                  icon="i-lucide-external-link"
                  class="justify-center mt-2"
                >
                  Buka Link Meeting (Zoom / Meet)
                </UButton>
              </div>

              <!-- Google Maps Link -->
              <div v-if="item.googleMapLink" class="rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700 p-4 space-y-2">
                <div class="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                  <UIcon name="i-lucide-map-pin" class="text-base text-primary" />
                  <span>Lokasi Pelaksanaan (Google Maps)</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-300">
                  {{ item.tempat }}
                </p>
                <UButton
                  :to="item.googleMapLink"
                  target="_blank"
                  color="neutral"
                  variant="subtle"
                  block
                  icon="i-lucide-map-pin"
                  class="justify-center mt-2"
                >
                  Lihat Lokasi di Google Maps
                </UButton>
              </div>

              <!-- Fallback Info if no link added yet -->
              <div v-if="!item.meetingLink && !item.googleMapLink" class="rounded-xl bg-gray-50 dark:bg-gray-700/30 p-4 text-center text-xs text-muted">
                <UIcon name="i-lucide-info" class="text-lg text-primary mb-1 mx-auto" />
                <p>Informasi link meeting / lokasi pelaksanaan akan diupdate oleh instruktur sebelum jadwal bootcamp dimulai.</p>
              </div>
            </template>
          </div>

          <!-- Status Member Card Banner -->
          <div
            class="rounded-xl p-4 text-xs space-y-1"
            :class="isBootcampExpired ? 'bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300' : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'"
          >
            <div class="font-semibold flex items-center gap-1.5">
              <UIcon :name="isBootcampExpired ? 'i-lucide-check-circle' : 'i-lucide-shield-check'" class="text-base" :class="isBootcampExpired ? 'text-gray-500' : 'text-emerald-600'" />
              <span>{{ isBootcampExpired ? 'Bootcamp Selesai' : 'Status Keikutsertaan Terverifikasi' }}</span>
            </div>
            <p class="mt-0.5">
              {{ isBootcampExpired ? 'Anda tercatat telah mengikuti bootcamp ini.' : 'Anda terdaftar secara resmi dalam bootcamp ini. Semua materi dan link sesi telah aktif.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

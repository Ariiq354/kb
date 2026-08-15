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
    return "/images/ebook-image-1.webp";
  if (item.value.foto.startsWith("http") || item.value.foto.startsWith("/")) {
    return item.value.foto;
  }
  return `${config.public.imageUrl}/${item.value.foto}`;
});

const pdfUrl = computed(() => {
  if (!item.value?.pdfUrl)
    return null;
  if (item.value.pdfUrl.startsWith("http") || item.value.pdfUrl.startsWith("/")) {
    return item.value.pdfUrl;
  }
  return `${config.public.imageUrl}/${item.value.pdfUrl}`;
});
</script>

<template>
  <div class="py-4 px-2 sm:px-4">
    <div v-if="status === 'pending'" class="py-8 flex justify-center">
      <USkeleton class="h-96 w-full max-w-4xl rounded-xl" />
    </div>

    <div v-else-if="!item" class="py-12 text-center text-muted">
      E-Book tidak ditemukan.
    </div>

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
      <!-- Main Product Details -->
      <div class="lg:col-span-3 space-y-6">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm md:p-8 space-y-5">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <UBadge
                icon="i-lucide-book-open"
                color="warning"
                variant="subtle"
              >
                E-Book
              </UBadge>
              <UBadge color="success" variant="subtle" icon="i-lucide-check-circle">
                Terverifikasi / Akses Aktif
              </UBadge>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {{ item.judul }}
            </h1>
          </div>

          <!-- Metadata Section -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div v-if="item.namaPublisher" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-user" class="text-primary" />
              <span>Penulis / Publisher: {{ item.namaPublisher }}</span>
            </div>
          </div>

          <!-- Description & Content Section -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Detail E-Book
            </h3>

            <!-- Short Description Summary -->
            <p
              v-if="item.deskripsi"
              class="text-base text-gray-700 dark:text-gray-300 leading-relaxed"
              :class="{ 'pb-4 border-b border-gray-200 dark:border-gray-700': item.konten }"
            >
              {{ item.deskripsi }}
            </p>

            <!-- Rich Text Content Body -->
            <div
              v-if="item.konten"
              class="prose prose-base max-w-none dark:prose-invert leading-relaxed text-gray-700 dark:text-gray-300"
              v-html="item.konten"
            />
            <p v-else-if="!item.deskripsi" class="text-sm text-gray-500 italic">
              Belum ada deskripsi atau konten.
            </p>
          </div>
        </div>
      </div>

      <!-- Access & Sidebar -->
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm md:p-6 space-y-5">
          <NuxtImg
            :src="imageUrl"
            class="w-full rounded-xl object-cover aspect-3/4 shadow-xs max-h-80 mx-auto"
          />

          <!-- Download Ebook PDF Button (If PDF available) -->
          <div v-if="pdfUrl" class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <UButton
              :to="pdfUrl"
              target="_blank"
              color="primary"
              block
              icon="i-lucide-file-text"
              class="justify-center"
            >
              Baca / Unduh File E-Book (PDF)
            </UButton>
          </div>

          <!-- Success Member Card Banner -->
          <div class="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-4 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <div class="font-semibold flex items-center gap-1.5">
              <UIcon name="i-lucide-shield-check" class="text-base text-emerald-600" />
              <span>Status Kepemilikan Aktif</span>
            </div>
            <p class="mt-0.5">
              Anda terdaftar secara resmi sebagai pemilik E-Book ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

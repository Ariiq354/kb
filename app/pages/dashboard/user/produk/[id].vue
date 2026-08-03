<script setup lang="ts">
import { computed, ref } from "vue";
import { useFetch, useRoute, useRuntimeConfig } from "#imports";
import FormatRupiah from "~/components/FormatRupiah.vue";
import { formatRupiah } from "~/utils/number";

const route = useRoute();
const config = useRuntimeConfig();

const { data: item, status } = await useFetch<any>(() => `/api/v1/produk/${route.params.id}`, {
  ignoreResponseError: true,
});

const kodeKupon = ref("");
const diskon = ref(0);
const isChecking = ref(false);
const kuponMessage = ref("");
const kuponValid = ref<boolean | null>(null);

const imageUrl = computed(() => {
  if (!item.value?.foto) {
    if (item.value?.type === "COURSE")
      return "/images/course-image-1.webp";
    if (item.value?.type === "EBOOK")
      return "/images/ebook-image-1.webp";
    return "/images/bootcamp-dummy.webp";
  }
  if (item.value.foto.startsWith("http") || item.value.foto.startsWith("/")) {
    return item.value.foto;
  }
  return `${config.public.imageUrl}/${item.value.foto}`;
});

const total = computed(() => Math.max(0, (item.value?.harga || 0) - diskon.value));

const productTypeBadge = computed(() => {
  switch (item.value?.type) {
    case "BOOTCAMP":
      return { label: "Bootcamp", icon: "i-lucide-graduation-cap", color: "primary" as const };
    case "COURSE":
      return { label: "Course", icon: "i-lucide-monitor-play", color: "info" as const };
    case "EBOOK":
      return { label: "E-Book", icon: "i-lucide-book-open", color: "warning" as const };
    default:
      return { label: "Produk", icon: "i-lucide-package", color: "neutral" as const };
  }
});

async function checkKupon() {
  if (!kodeKupon.value.trim()) {
    kuponMessage.value = "Masukkan kode kupon terlebih dahulu";
    kuponValid.value = false;
    return;
  }

  isChecking.value = true;
  kuponMessage.value = "";

  try {
    const res = await $fetch<{ valid: boolean; persen: number; message: string }>("/api/v1/diskon/check", {
      method: "POST",
      body: { code: kodeKupon.value.trim() },
    });

    if (res.valid) {
      diskon.value = Math.round((item.value?.harga || 0) * (res.persen / 100));
      kuponValid.value = true;
      kuponMessage.value = res.message || "Kupon berhasil diterapkan!";
    }
    else {
      diskon.value = 0;
      kuponValid.value = false;
      kuponMessage.value = res.message || "Kode kupon tidak valid";
    }
  }
  catch {
    diskon.value = 0;
    kuponValid.value = false;
    kuponMessage.value = "Gagal memverifikasi kupon";
  }
  finally {
    isChecking.value = false;
  }
}
</script>

<template>
  <div class="py-4 px-2 sm:px-4">
    <div v-if="status === 'pending'" class="py-8 flex justify-center">
      <USkeleton class="h-96 w-full max-w-4xl rounded-xl" />
    </div>

    <div v-else-if="!item" class="py-12 text-center text-muted">
      Produk tidak ditemukan.
    </div>

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
      <!-- Main Product Details -->
      <div class="lg:col-span-3 space-y-6">
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm md:p-8">
          <div class="mb-4">
            <UBadge
              :icon="productTypeBadge.icon"
              :color="productTypeBadge.color"
              variant="subtle"
              class="mb-3"
            >
              {{ productTypeBadge.label }}
            </UBadge>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {{ item.judul }}
            </h1>
          </div>

          <!-- Metadata Section -->
          <div class="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-4">
            <!-- Bootcamp Metadata -->
            <template v-if="item.type === 'BOOTCAMP'">
              <div v-if="item.pembicara" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-user" class="text-primary" />
                <span>{{ item.pembicara }}</span>
              </div>
              <div v-if="item.waktu" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-calendar" class="text-primary" />
                <span>{{ item.waktu }}</span>
              </div>
              <div v-if="item.tempat" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-map-pin" class="text-primary" />
                <span>{{ item.tempat }}</span>
              </div>
              <div v-if="item.tipe" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-laptop" class="text-primary" />
                <span>{{ item.tipe }}</span>
              </div>
            </template>

            <!-- Course Metadata -->
            <template v-else-if="item.type === 'COURSE'">
              <div v-if="item.namaPublisher" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-user" class="text-primary" />
                <span>Publisher: {{ item.namaPublisher }}</span>
              </div>
              <div v-if="item.totalVideo !== undefined" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-video" class="text-primary" />
                <span>{{ item.totalVideo }} Video</span>
              </div>
            </template>

            <!-- Ebook Metadata -->
            <template v-else-if="item.type === 'EBOOK'">
              <div v-if="item.namaPublisher" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-user" class="text-primary" />
                <span>Penulis: {{ item.namaPublisher }}</span>
              </div>
            </template>
          </div>

          <!-- Description -->
          <div
            class="prose prose-base max-w-none dark:prose-invert leading-relaxed text-gray-700 dark:text-gray-300"
            v-html="item.deskripsi || 'Belum ada deskripsi.'"
          />
        </div>
      </div>

      <!-- Pricing & Checkout Sidebar -->
      <div class="h-fit rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-5 py-5 shadow-sm md:px-8 lg:col-span-2 space-y-4">
        <NuxtImg
          :src="imageUrl"
          class="w-full rounded-xl object-cover aspect-video"
        />

        <div class="mt-4 flex flex-col gap-3 py-3 sm:flex-row sm:gap-4">
          <UInput
            v-model="kodeKupon"
            placeholder="Kode Kupon (jika ada)"
            class="w-full sm:flex-1"
            @keyup.enter="checkKupon"
          />
          <UButton
            :loading="isChecking"
            color="primary"
            variant="soft"
            class="justify-center sm:w-auto"
            @click="checkKupon"
          >
            Check
          </UButton>
        </div>

        <p
          v-if="kuponMessage"
          class="-mt-2 mb-2 text-sm"
          :class="kuponValid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
        >
          {{ kuponMessage }}
        </p>

        <div class="flex flex-col gap-2 border-y border-gray-200 dark:border-gray-700 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <div class="flex justify-between gap-4">
            <p>Harga</p>
            <p class="text-gray-900 dark:text-white">
              {{ formatRupiah(item.harga) }}
            </p>
          </div>
          <div class="flex justify-between gap-4">
            <p>Diskon</p>
            <p class="text-gray-900 dark:text-white">
              {{ formatRupiah(diskon) }}
            </p>
          </div>
        </div>

        <div class="flex justify-between gap-4 py-3 items-center">
          <p class="font-medium text-gray-500 dark:text-gray-400">
            Total
          </p>
          <FormatRupiah
            :value="total"
            number-class="text-xl font-bold text-gray-900 dark:text-white"
          />
        </div>

        <UButton color="primary" class="flex w-full justify-center" size="lg">
          Checkout
        </UButton>
      </div>
    </div>
  </div>
</template>

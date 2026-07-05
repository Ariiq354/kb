<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
useHead({
  title: "Produk",
});

const toast = useToast();
const config = useRuntimeConfig();
const imgUrl = config.public.imageUrl;

const tabs = [
  { label: "Bootcamp", slot: "bootcamp" },
  { label: "Ebook", slot: "ebook" },
  { label: "Course", slot: "course" },
];

const { data: bootcampRes, pending: pendingBootcamp } = useFetch("/api/v1/bootcamp");
const { data: ebookRes, pending: pendingEbook } = useFetch("/api/v1/ebook");
const { data: courseRes, pending: pendingCourse } = useFetch("/api/v1/course");

const isBuying = ref<number | null>(null);

async function buyProduct(produkId: number) {
  isBuying.value = produkId;
  try {
    await $fetch("/api/v1/orders", {
      method: "POST",
      body: { produkId },
    });
    toast.add({ title: "Pesanan berhasil dibuat", color: "green" });
    navigateTo("/dashboard/user/transaksi");
  }
  catch (e: any) {
    toast.add({ title: "Gagal membuat pesanan", description: e.data?.message || e.message, color: "red" });
  }
  finally {
    isBuying.value = null;
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Katalog Produk
      </h1>
    </div>

    <UTabs :items="tabs" class="w-full">
      <template #bootcamp="{ item }">
        <div v-if="pendingBootcamp" class="py-10 text-center">
          Loading...
        </div>
        <div v-else-if="!bootcampRes?.data?.length" class="py-10 text-center text-gray-500">
          Tidak ada produk bootcamp saat ini.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          <UCard v-for="b in bootcampRes.data" :key="b.id" class="flex flex-col h-full" :ui="{ body: { padding: 'p-0 sm:p-0' }, footer: { base: 'mt-auto' } }">
            <div class="h-48 overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
              <img v-if="b.produk?.foto" :src="`${imgUrl}/${b.produk.foto}`" alt="Cover" class="w-full h-full object-cover">
            </div>
            <div class="p-4 space-y-2 flex-1">
              <div class="flex items-start justify-between">
                <h3 class="font-bold text-lg leading-tight">
                  {{ b.produk?.judul }}
                </h3>
                <UBadge v-if="b.tipe" size="sm" color="blue" variant="subtle">
                  {{ b.tipe }}
                </UBadge>
              </div>
              <p class="text-primary-500 font-bold text-lg">
                Rp {{ b.produk?.harga?.toLocaleString('id-ID') }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {{ b.deskripsi }}
              </p>

              <div class="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <div v-if="b.pembicara" class="flex items-center gap-2">
                  <UIcon name="i-lucide-user" /> {{ b.pembicara }}
                </div>
                <div v-if="b.waktu" class="flex items-center gap-2">
                  <UIcon name="i-lucide-calendar" /> {{ b.waktu }}
                </div>
              </div>
            </div>
            <template #footer>
              <UButton class="w-full justify-center" :loading="isBuying === b.produkId" @click="buyProduct(b.produkId)">
                Beli Sekarang
              </UButton>
            </template>
          </UCard>
        </div>
      </template>

      <template #ebook="{ item }">
        <div v-if="pendingEbook" class="py-10 text-center">
          Loading...
        </div>
        <div v-else-if="!ebookRes?.data?.length" class="py-10 text-center text-gray-500">
          Tidak ada produk ebook saat ini.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          <UCard v-for="e in ebookRes.data" :key="e.id" class="flex flex-col h-full" :ui="{ body: { padding: 'p-0 sm:p-0' }, footer: { base: 'mt-auto' } }">
            <div class="h-48 overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
              <img v-if="e.produk?.foto" :src="`${imgUrl}/${e.produk.foto}`" alt="Cover" class="w-full h-full object-cover">
            </div>
            <div class="p-4 space-y-2 flex-1">
              <h3 class="font-bold text-lg leading-tight">
                {{ e.produk?.judul }}
              </h3>
              <p class="text-primary-500 font-bold text-lg">
                Rp {{ e.produk?.harga?.toLocaleString('id-ID') }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {{ e.deskripsi }}
              </p>

              <div class="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <div v-if="e.penulis" class="flex items-center gap-2">
                  <UIcon name="i-lucide-pen-tool" /> {{ e.penulis }}
                </div>
              </div>
            </div>
            <template #footer>
              <UButton class="w-full justify-center" :loading="isBuying === e.produkId" @click="buyProduct(e.produkId)">
                Beli Sekarang
              </UButton>
            </template>
          </UCard>
        </div>
      </template>

      <template #course="{ item }">
        <div v-if="pendingCourse" class="py-10 text-center">
          Loading...
        </div>
        <div v-else-if="!courseRes?.data?.length" class="py-10 text-center text-gray-500">
          Tidak ada produk course saat ini.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          <UCard v-for="c in courseRes.data" :key="c.id" class="flex flex-col h-full" :ui="{ body: { padding: 'p-0 sm:p-0' }, footer: { base: 'mt-auto' } }">
            <div class="h-48 overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
              <img v-if="c.produk?.foto" :src="`${imgUrl}/${c.produk.foto}`" alt="Cover" class="w-full h-full object-cover">
            </div>
            <div class="p-4 space-y-2 flex-1">
              <h3 class="font-bold text-lg leading-tight">
                {{ c.produk?.judul }}
              </h3>
              <p class="text-primary-500 font-bold text-lg">
                Rp {{ c.produk?.harga?.toLocaleString('id-ID') }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {{ c.deskripsi }}
              </p>

              <div class="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <div v-if="c.mentor" class="flex items-center gap-2">
                  <UIcon name="i-lucide-users" /> {{ c.mentor }}
                </div>
                <div v-if="c.level" class="flex items-center gap-2">
                  <UBadge size="xs" color="gray" variant="solid">
                    {{ c.level }}
                  </UBadge>
                </div>
              </div>
            </div>
            <template #footer>
              <UButton class="w-full justify-center" :loading="isBuying === c.produkId" @click="buyProduct(c.produkId)">
                Beli Sekarang
              </UButton>
            </template>
          </UCard>
        </div>
      </template>
    </UTabs>
  </div>
</template>

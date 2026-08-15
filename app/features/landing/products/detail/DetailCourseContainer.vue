<script setup lang="ts">
import { computed, ref } from "vue";
import { useFetch, useRoute, useRuntimeConfig } from "#imports";
import FormatRupiah from "~/components/FormatRupiah.vue";
import ModalAlreadyPurchased from "~/components/Modal/ModalAlreadyPurchased.vue";
import ModalCheckoutPayment from "~/components/Modal/ModalCheckoutPayment.vue";
import ModalPendingOrder from "~/components/Modal/ModalPendingOrder.vue";
import { useAuthSession } from "~/composables/auth";
import { openModal } from "~/composables/modal";
import { useToastError } from "~/composables/toast";
import { formatRupiah } from "~/utils/number";

const route = useRoute();
const config = useRuntimeConfig();
const { session } = await useAuthSession();

const { data: item, status } = await useFetch<any>(() => `/api/v1/produk/${route.params.id}`);

const kodeKupon = ref("");
const diskon = ref(0);
const isChecking = ref(false);
const kuponMessage = ref("");
const kuponValid = ref<boolean | null>(null);

const imageUrl = computed(() => {
  if (!item.value?.foto)
    return "/images/course-image-1.webp";
  if (item.value.foto.startsWith("http") || item.value.foto.startsWith("/"))
    return item.value.foto;
  return `${config.public.imageUrl}/${item.value.foto}`;
});

const total = computed(() => Math.max(0, (item.value?.harga || 0) - diskon.value));

async function handleCheckout() {
  if (!item.value)
    return;

  try {
    const checkRes = await $fetch<any>("/api/v1/order/check", {
      query: { produkId: item.value.id },
    });

    if (checkRes.hasOrder && checkRes.status === "PAID") {
      openModal(ModalAlreadyPurchased, {
        produk: {
          id: item.value.id,
          type: "COURSE",
          judul: item.value.judul,
        },
      });
      return;
    }

    if (checkRes.hasOrder && (checkRes.status === "WAITING_VERIFICATION" || checkRes.status === "PENDING_PAYMENT")) {
      openModal(ModalPendingOrder, {
        produk: {
          id: item.value.id,
          type: "COURSE",
          judul: item.value.judul,
        },
        order: checkRes.order,
      });
      return;
    }
  }
  catch {}

  if (total.value === 0) {
    try {
      await $fetch("/api/v1/order", {
        method: "POST",
        body: {
          produkId: item.value.id,
          kodeKupon: kodeKupon.value.trim() || undefined,
        },
      });
    }
    catch (error: any) {
      useToastError("Gagal Membuat Pesanan", error?.data?.message || "Terjadi kesalahan saat memproses pesanan.");
      return;
    }

    openModal(ModalCheckoutPayment, {
      produk: {
        id: item.value.id,
        type: "COURSE",
        judul: item.value.judul,
        harga: item.value.harga,
        foto: item.value.foto,
      },
      diskon: diskon.value,
      kodeKupon: kodeKupon.value.trim() || undefined,
      total: 0,
      initialSuccess: true,
    });
    return;
  }

  openModal(ModalCheckoutPayment, {
    produk: {
      id: item.value.id,
      type: "COURSE",
      judul: item.value.judul,
      harga: item.value.harga,
      foto: item.value.foto,
    },
    diskon: diskon.value,
    kodeKupon: kodeKupon.value.trim() || undefined,
    total: total.value,
  });
}

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
  <main class="w-full min-h-screen bg-[url('/images/landingbg1.webp')] object-cover bg-repeat-y bg-center">
    <div v-if="status === 'pending'" class="container py-12 flex justify-center">
      <USkeleton class="h-96 w-full max-w-4xl rounded-xl" />
    </div>

    <div v-else-if="!item" class="container py-12 text-center text-muted">
      Detail course tidak ditemukan.
    </div>

    <section v-else class="container grid grid-cols-1 gap-6 px-4 py-6 md:px-6 md:py-10 lg:grid-cols-5 lg:gap-8">
      <div class="lg:col-span-3">
        <div class="rounded-xl border border-gray-300 bg-white p-5 shadow-md md:p-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">
            {{ item.judul }}
          </h1>

          <div v-if="item.namaPublisher" class="mb-4 text-sm text-gray-600">
            Publisher: <span class="font-medium text-gray-800">{{ item.namaPublisher }}</span>
          </div>

          <!-- Short Description Summary -->
          <p
            v-if="item.deskripsi"
            class="text-base text-gray-700 leading-relaxed"
            :class="{ 'mb-6 pb-6 border-b border-gray-200': item.konten }"
          >
            {{ item.deskripsi }}
          </p>

          <!-- Rich Text Content Body -->
          <div
            v-if="item.konten"
            class="prose prose-base max-w-none md:prose-lg leading-relaxed text-gray-700"
            v-html="item.konten"
          />
          <p v-else-if="!item.deskripsi" class="text-sm text-gray-500 italic">
            Belum ada deskripsi atau konten.
          </p>
        </div>
      </div>

      <div class="h-fit rounded-xl border border-gray-300 bg-white px-5 py-5 shadow-md md:px-8 lg:col-span-2">
        <NuxtImg
          :src="imageUrl"
          class="w-full rounded-xl object-cover aspect-video"
        />

        <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <UIcon name="i-lucide-video" class="text-lg" />
          <p>{{ item.totalVideo || 0 }} Video</p>
        </div>

        <div class="mt-4 flex flex-col gap-3 py-5 sm:flex-row sm:gap-4">
          <UInput
            v-model="kodeKupon"
            placeholder="Kode Kupon (jika ada)"
            class="w-full sm:flex-1"
            @keyup.enter="checkKupon"
          />
          <UButton
            :loading="isChecking"
            class="justify-center sm:w-auto"
            @click="checkKupon"
          >
            Check
          </UButton>
        </div>

        <p
          v-if="kuponMessage"
          class="-mt-3 mb-3 text-sm"
          :class="kuponValid ? 'text-green-600' : 'text-red-500'"
        >
          {{ kuponMessage }}
        </p>

        <div class="flex flex-col gap-2 border-y border-gray-300 py-4 text-sm font-extralight text-gray-500">
          <div class="flex justify-between gap-4">
            <p>Harga</p>
            <p>{{ formatRupiah(item.harga) }}</p>
          </div>
          <div class="flex justify-between gap-4">
            <p>Diskon</p>
            <p>{{ formatRupiah(diskon) }}</p>
          </div>
        </div>

        <div class="flex justify-between gap-4 py-5">
          <p class="font-extralight text-gray-500">
            Total
          </p>
          <FormatRupiah
            :value="total"
            number-class="text-xl font-bold text-black"
          />
        </div>

        <UButton v-if="session" class="flex w-full justify-center" @click="handleCheckout">
          Checkout
        </UButton>
        <p v-else class="text-center text-sm text-gray-500">
          Harus login terlebih dahulu untuk checkout
        </p>
      </div>
    </section>
  </main>
</template>

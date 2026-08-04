<script setup lang="ts">
import { computed, ref } from "vue";
import { navigateTo } from "#imports";
import FormatRupiah from "~/components/FormatRupiah.vue";
import { useToastError } from "~/composables/toast";
import { formatRupiah } from "~/utils/number";

const props = defineProps<{
  produk: {
    id: number;
    type: "BOOTCAMP" | "EBOOK" | "COURSE" | string;
    judul: string;
    harga: number;
    foto?: string;
  };
  diskon: number;
  kodeKupon?: string;
  total: number;
  initialSuccess?: boolean;
}>();

const emit = defineEmits(["close"]);

const loading = ref(false);
const isSuccess = ref(props.initialSuccess ?? false);
const createdOrder = ref<any>(null);

const productTypePath = computed(() => {
  switch (props.produk.type) {
    case "EBOOK":
      return "ebook";
    case "COURSE":
      return "course";
    default:
      return "bootcamp";
  }
});

async function handleProcessOrder() {
  loading.value = true;
  try {
    const res = await $fetch<any>("/api/v1/order", {
      method: "POST",
      body: {
        produkId: props.produk.id,
        kodeKupon: props.kodeKupon,
      },
    });

    createdOrder.value = res;
    isSuccess.value = true;
  }
  catch (error: any) {
    useToastError("Gagal Membuat Pesanan", error?.data?.message || "Terjadi kesalahan saat memproses pesanan.");
  }
  finally {
    loading.value = false;
  }
}

function goToPurchasedProducts() {
  emit("close");
  navigateTo(`/dashboard/user/produk/${productTypePath.value}`);
}

function goToTransactions() {
  emit("close");
  navigateTo("/dashboard/user/transaksi");
}
</script>

<template>
  <UModal
    :title="isSuccess ? 'Status Pembayaran' : 'Detail & Konfirmasi Pembayaran'"
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ body: 'sm:max-w-lg' }"
  >
    <template #body>
      <!-- Success State -->
      <div v-if="isSuccess" class="space-y-5 py-3 text-center">
        <!-- 0 Rupiah Free Success -->
        <template v-if="total === 0">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <UIcon name="i-lucide-check-circle" size="36" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Transaksi Berhasil!
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Selamat! Produk <span class="font-semibold text-gray-900 dark:text-white">{{ produk.judul }}</span> berhasil diaktifkan secara gratis di akun Anda.
            </p>
          </div>
        </template>

        <!-- QRIS Transfer Success (Pending verification / Paid) -->
        <template v-else>
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <UIcon name="i-lucide-clock" size="36" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Pesanan Berhasil Dibuat!
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Silakan lakukan pembayaran sebesar
              <span class="font-bold text-primary">{{ formatRupiah(total) }}</span>
              via QRIS atau Transfer Bank. Status pembayaran akan diverifikasi oleh admin.
            </p>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 text-left space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div class="flex justify-between">
              <span>Nomor Transaksi</span>
              <span class="font-mono font-semibold text-gray-900 dark:text-white">#ORD-{{ createdOrder?.id }}</span>
            </div>
            <div class="flex justify-between">
              <span>Status</span>
              <UBadge color="warning" variant="subtle" size="sm">
                {{ createdOrder?.status === 'PAID' ? 'Lunas' : 'Menunggu Verifikasi' }}
              </UBadge>
            </div>
          </div>
        </template>
      </div>

      <!-- Initial Checkout / Payment Form State -->
      <div v-else class="space-y-5 py-1">
        <!-- Product Brief Header -->
        <div class="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
          <div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <NuxtImg
              v-if="produk.foto"
              :src="produk.foto.startsWith('http') || produk.foto.startsWith('/') ? produk.foto : `/images/${produk.foto}`"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
              <UIcon name="i-lucide-package" size="24" />
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <UBadge size="sm" variant="subtle" class="mb-1">
              {{ produk.type }}
            </UBadge>
            <h4 class="line-clamp-1 font-semibold text-gray-900 dark:text-white text-sm">
              {{ produk.judul }}
            </h4>
          </div>
        </div>

        <!-- Rincian Harga -->
        <div class="space-y-2 text-sm border-t border-b border-gray-200 dark:border-gray-700 py-3">
          <div class="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Harga Asli</span>
            <span class="text-gray-900 dark:text-white font-medium">{{ formatRupiah(produk.harga) }}</span>
          </div>
          <div class="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Diskon Kupon</span>
            <span class="text-green-600 dark:text-green-400 font-medium">- {{ formatRupiah(diskon) }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-base font-bold text-gray-900 dark:text-white">
            <span>Total Pembayaran</span>
            <FormatRupiah :value="total" number-class="text-primary text-lg" />
          </div>
        </div>

        <!-- Payment Transfer Section (If total > 0) -->
        <div v-if="total > 0" class="space-y-4">
          <div class="text-center">
            <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Pembayaran via QRIS / Transfer Bank
            </h5>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Pindai QRIS di bawah ini atau transfer ke rekening BCA
            </p>
          </div>

          <div class="flex justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white">
            <NuxtImg
              src="/images/contohqris.png"
              alt="QRIS Pembayaran"
              class="h-52 object-contain"
            />
          </div>

          <div class="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 p-3 text-xs text-blue-900 dark:text-blue-200 space-y-1">
            <div class="font-semibold flex items-center gap-1.5">
              <UIcon name="i-lucide-building-2" />
              <span>Transfer Bank BCA</span>
            </div>
            <div>No. Rekening: <span class="font-mono font-bold select-all">1234 5678 90</span></div>
            <div>Atas Nama: <span class="font-medium">Keluarga Bahagia</span></div>
          </div>
        </div>

        <!-- Free Product Alert (If total == 0) -->
        <div v-else class="rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/50 p-4 text-xs text-green-900 dark:text-green-200 flex items-start gap-3">
          <UIcon name="i-lucide-gift" class="text-green-600 text-lg shrink-0 mt-0.5" />
          <div>
            <div class="font-semibold text-sm">
              Diskon 100% (Gratis)
            </div>
            <p class="mt-0.5">
              Produk ini dapat langsung diaktifkan secara gratis tanpa biaya pembayaran.
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <!-- Footer buttons when success -->
      <div v-if="isSuccess" class="flex w-full justify-end gap-3">
        <UButton
          v-if="total > 0"
          color="neutral"
          variant="subtle"
          icon="i-lucide-receipt"
          @click="goToTransactions"
        >
          Lihat Transaksi
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-arrow-right"
          @click="goToPurchasedProducts"
        >
          Akses Produk Saya
        </UButton>
      </div>

      <!-- Footer buttons when initial checkout -->
      <div v-else class="flex w-full justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          :disabled="loading"
          @click="emit('close')"
        >
          Batal
        </UButton>
        <UButton
          color="primary"
          :icon="total === 0 ? 'i-lucide-check' : 'i-lucide-credit-card'"
          :loading="loading"
          @click="handleProcessOrder"
        >
          {{ total === 0 ? 'Selesaikan Transaksi (Gratis)' : 'Konfirmasi & Bayar' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

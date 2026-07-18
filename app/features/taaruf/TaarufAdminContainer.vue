<script setup lang="ts">
import type { TaarufProsesAdmin } from "./types";
import { reactive, ref } from "vue";
import { openModal } from "~/composables/modal";
import { useToastError, useToastSuccess } from "~/composables/toast";
import TaarufAdminCard from "./components/TaarufAdminCard.vue";
import TaarufHistoryModal from "./components/TaarufHistoryModal.vue";

// 1. Fetch all ta'aruf processes for admin
const { data: processes, refresh, pending } = await useFetch("/api/v1/taaruf/admin");

// 2. Log History Modal Action
function viewHistory(id: number) {
  openModal(TaarufHistoryModal, { prosesId: id });
}

// 3. Update Status Modal State
const isUpdateOpen = ref(false);
const updateForm = reactive({
  id: null as number | null,
  requesterName: "",
  targetName: "",
  status: "PENDING" as "PENDING" | "APPROVED" | "PROFILE_EXCHANGE" | "TAARUF" | "REJECTED" | "CANCELLED" | "MARRIED",
  keterangan: "",
});
const isSubmitting = ref(false);

function openUpdate(p: TaarufProsesAdmin) {
  updateForm.id = p.id;
  updateForm.requesterName = p.requester.name ?? "";
  updateForm.targetName = p.target.name ?? "";
  updateForm.status = p.status as "PENDING" | "APPROVED" | "PROFILE_EXCHANGE" | "TAARUF" | "REJECTED" | "CANCELLED" | "MARRIED";
  updateForm.keterangan = "";
  isUpdateOpen.value = true;
}

async function submitUpdateStatus() {
  if (!updateForm.id)
    return;

  isSubmitting.value = true;
  try {
    await $fetch(`/api/v1/taaruf/admin/${updateForm.id}`, {
      method: "PATCH",
      body: {
        status: updateForm.status,
        keterangan: updateForm.keterangan || undefined,
      },
    });
    useToastSuccess("Status Diperbarui", "Status progress ta'aruf berhasil di-update.");
    isUpdateOpen.value = false;
    await refresh();
  }
  catch (err: unknown) {
    const errorDetails = err as { data?: { message?: string } };
    useToastError("Gagal Mengubah Status", errorDetails.data?.message || "Terjadi kesalahan.");
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header banner -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="space-y-1 text-center sm:text-left">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
            <UIcon name="i-lucide-settings" class="text-primary size-5.5" />
            Kelola Progress Ta'aruf Anggota
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Halaman ini menampilkan seluruh pengajuan dan status proses ta'aruf aktif maupun pasif antar anggota.
          </p>
        </div>
      </div>
    </div>

    <!-- Skeletons while loading -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4 shadow-xs">
        <USkeleton class="h-6 w-1/3" />
        <USkeleton class="h-8 w-2/3" />
        <USkeleton class="h-10 w-full rounded-lg" />
      </div>
    </div>

    <div v-else>
      <!-- Empty State -->
      <div
        v-if="!processes || processes.length === 0"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-4"
      >
        <div class="bg-primary-50 dark:bg-primary-950/20 p-4 rounded-full text-primary">
          <UIcon name="i-lucide-clipboard-x" class="size-10" />
        </div>
        <div class="space-y-1">
          <h4 class="font-bold text-gray-900 dark:text-white text-lg">
            Tidak Ada Pengajuan Ta'aruf
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Saat ini belum ada anggota yang mengajukan ta'aruf satu sama lain di sistem.
          </p>
        </div>
      </div>

      <!-- Processes Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaarufAdminCard
          v-for="p in processes"
          :key="p.id"
          :proses="p"
          @riwayat="viewHistory"
          @update="openUpdate"
        />
      </div>
    </div>

    <!-- Update Status Modal -->
    <LazyUModal
      v-model:open="isUpdateOpen"
      title="Perbarui Status Ta'aruf"
      class="max-w-md"
    >
      <template #body>
        <UForm :state="updateForm" class="space-y-5" @submit="submitUpdateStatus">
          <div class="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-100 dark:border-gray-850 text-sm space-y-1 mb-2">
            <p class="text-gray-500 dark:text-gray-400">
              Pemohon: <span class="font-bold text-gray-900 dark:text-white">{{ updateForm.requesterName }}</span>
            </p>
            <p class="text-gray-500 dark:text-gray-400">
              Penerima: <span class="font-bold text-gray-900 dark:text-white">{{ updateForm.targetName }}</span>
            </p>
          </div>

          <!-- Status Dropdown Select -->
          <UFormField label="Status Progress Baru" name="status">
            <USelect
              v-model="updateForm.status"
              :items="[
                { label: 'Menunggu Persetujuan', value: 'PENDING' },
                { label: 'Disetujui Admin', value: 'APPROVED' },
                { label: 'Pertukaran CV / Biodata', value: 'PROFILE_EXCHANGE' },
                { label: 'Sedang Ta\'aruf', value: 'TAARUF' },
                { label: 'Ditolak', value: 'REJECTED' },
                { label: 'Dibatalkan', value: 'CANCELLED' },
                { label: 'Sudah Menikah (Married)', value: 'MARRIED' },
              ]"
              placeholder="Pilih Status"
              class="w-full"
            />
          </UFormField>

          <!-- Keterangan Textarea -->
          <UFormField label="Keterangan / Catatan Log" name="keterangan">
            <UTextarea
              v-model="updateForm.keterangan"
              placeholder="Contoh: Berkas CV berhasil ditukar ke kedua belah pihak..."
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <UButton color="neutral" variant="subtle" @click="() => { isUpdateOpen = false; }">
              Batal
            </UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting">
              Simpan
            </UButton>
          </div>
        </UForm>
      </template>
    </LazyUModal>
  </div>
</template>

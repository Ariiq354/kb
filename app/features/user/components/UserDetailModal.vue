<script setup lang="ts">
import type { UserDetail } from "../constants";
import { computed, ref } from "vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { formatDateIndo } from "~/utils";

const props = defineProps<{
  user: UserDetail | null;
}>();

const emit = defineEmits<{
  (e: "success"): void;
}>();

const openModel = defineModel<boolean>("open", {
  required: true,
});

const config = useRuntimeConfig();

const user = computed(() => props.user);
const isLoading = false;

const showBanForm = ref(false);
const banReason = ref("");
const isSubmittingBan = ref(false);

async function toggleBanStatus(banned: boolean) {
  if (banned && !showBanForm.value) {
    showBanForm.value = true;
    banReason.value = "";
    return;
  }

  isSubmittingBan.value = true;
  try {
    await $fetch(`/api/v1/users/${props.user?.id}/ban`, {
      method: "POST",
      body: {
        banned,
        banReason: banned ? banReason.value : null,
      },
    });

    useToastSuccess(
      banned ? "Anggota Ditangguhkan" : "Tangguhan Dibuka",
      banned
        ? `Anggota ${props.user?.name} berhasil ditangguhkan.`
        : `Tangguhan untuk anggota ${props.user?.name} berhasil dibuka.`,
    );
    showBanForm.value = false;
    banReason.value = "";
    emit("success");
  }
  catch (error: any) {
    console.error(error);
    useToastError("Gagal Mengubah Status", error.data?.message || "Terjadi kesalahan.");
  }
  finally {
    isSubmittingBan.value = false;
  }
}

function cancelBan() {
  showBanForm.value = false;
  banReason.value = "";
}
</script>

<template>
  <LazyUModal
    v-model:open="openModel"
    title="Detail Anggota"
    class="max-w-4xl"
  >
    <template #body>
      <div v-if="isLoading" class="space-y-6 py-4">
        <!-- Skeleton Loading State -->
        <div class="flex items-center gap-4">
          <USkeleton class="h-16 w-16 rounded-full" />
          <div class="space-y-2">
            <USkeleton class="h-6 w-48" />
            <USkeleton class="h-4 w-32" />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <USkeleton v-for="i in 4" :key="i" class="h-24 w-full rounded-lg" />
        </div>
      </div>

      <div v-else-if="user" class="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
        <!-- Header Info -->
        <div class="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-muted">
          <UAvatar
            :src="user.image ? (user.image.startsWith('http') ? user.image : `${config.public.imageUrl}/${user.image}`) : undefined"
            :alt="user.name"
            size="xl"
            class="bg-gray-100 dark:bg-gray-850"
          />
          <div class="text-center sm:text-left space-y-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ user.name }}
            </h3>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
              <span>ID: {{ user.id }}</span>
              <span v-if="user.kodeUser" class="text-gray-300 dark:text-gray-700">•</span>
              <span v-if="user.kodeUser" class="font-semibold text-primary-600 dark:text-primary-400">Kode: {{ user.kodeUser }}</span>
              <span class="text-gray-300 dark:text-gray-700">•</span>
              <span>Terdaftar: {{ formatDateIndo(user.createdAt ? new Date(user.createdAt).toISOString() : null) }}</span>
            </div>
            <div class="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
              <UBadge
                :color="user.role === 'admin' ? 'primary' : 'neutral'"
                variant="subtle"
              >
                {{ user.role === 'admin' ? 'Admin' : 'Anggota' }}
              </UBadge>
              <UBadge
                :color="user.banned ? 'error' : 'success'"
                variant="subtle"
              >
                {{ user.banned ? 'Banned' : 'Aktif' }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Ban Information if Banned -->
        <UAlert
          v-if="user.banned"
          icon="i-lucide-ban"
          color="error"
          variant="subtle"
          title="Anggota ini sedang ditangguhkan (Banned)"
          :description="`Alasan: ${user.banReason || 'Tidak ada alasan'}`"
        />

        <!-- Profil Belum Lengkap Warning -->
        <UAlert
          v-if="!user.kodeUser"
          icon="i-lucide-info"
          color="warning"
          variant="subtle"
          title="Profil Belum Lengkap"
          description="Anggota ini belum mengisi/melengkapi data profil ta'aruf."
        />

        <!-- Grid Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Data Akun & Kontak -->
          <div class="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl space-y-4 border border-muted">
            <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-muted pb-2">
              <UIcon name="i-lucide-user" class="text-primary-500" />
              Data Akun & Kontak
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Email:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">No. Telepon:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.noTelepon || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Gender:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.gender || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Tanggal Lahir:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.tanggalLahir ? formatDateIndo(user.tanggalLahir) : '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Status Kawin:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.statusKawin || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Latar Belakang & Pekerjaan -->
          <div class="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl space-y-4 border border-muted">
            <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-muted pb-2">
              <UIcon name="i-lucide-briefcase" class="text-primary-500" />
              Latar Belakang & Pekerjaan
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Agama:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.agama || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Suku:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.suku || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Pendidikan:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.pendidikan || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Pekerjaan / Jurusan:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ user.pekerjaan || '-' }} {{ user.jurusan ? `(${user.jurusan})` : '' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Gaji Bulanan:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ user.gaji ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(user.gaji) : '-' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Domisili -->
          <div class="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl space-y-4 border border-muted">
            <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-muted pb-2">
              <UIcon name="i-lucide-map-pin" class="text-primary-500" />
              Domisili
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Kelurahan:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user?.kelurahanNama || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Kecamatan:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user?.kecamatanNama || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Kota / Kabupaten:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user?.kotaNama || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Provinsi:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user?.provinsiNama || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Data Fisik & Keluarga -->
          <div class="bg-gray-50 dark:bg-gray-855 p-4 rounded-xl space-y-4 border border-muted">
            <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-muted pb-2">
              <UIcon name="i-lucide-activity" class="text-primary-500" />
              Fisik & Keluarga
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Tinggi / Berat:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ user.tinggi ? `${user.tinggi} cm` : '-' }} / {{ user.berat ? `${user.berat} kg` : '-' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Perokok:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ user.perokok ? 'Ya' : 'Tidak' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Nama Ayah:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ user.namaAyah || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Anak Ke / Bersaudara:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  Anak ke-{{ user.anakKe || '-' }} dari {{ user.dariBersaudara || '-' }} bersaudara
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bio & Social -->
        <div class="bg-gray-50 dark:bg-gray-855 p-4 rounded-xl space-y-3 border border-muted">
          <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-muted pb-2">
            <UIcon name="i-lucide-smile" class="text-primary-500" />
            Sosial & Hobbi
          </h4>
          <div class="space-y-3 text-sm">
            <div class="flex flex-col gap-1">
              <span class="text-gray-500 dark:text-gray-400 font-medium">Hobi:</span>
              <p class="text-gray-900 dark:text-white leading-relaxed">
                {{ user.hobi || '-' }}
              </p>
            </div>
            <div class="flex justify-between border-t border-muted pt-2">
              <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <UIcon name="i-lucide-instagram" /> Instagram:
              </span>
              <span class="font-medium text-primary-600 dark:text-primary-400">
                {{ user.instagram ? `@${user.instagram.replace('@', '')}` : '-' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Deskripsi & Kriteria -->
        <div class="grid grid-cols-1 gap-6">
          <div class="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl space-y-2 border border-muted">
            <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-muted pb-2">
              <UIcon name="i-lucide-file-text" class="text-primary-500" />
              Deskripsi Diri
            </h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {{ user.deskripsi || 'Tidak ada deskripsi' }}
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl space-y-2 border border-muted">
            <h4 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-muted pb-2">
              <UIcon name="i-lucide-heart" class="text-primary-500" />
              Kriteria Pasangan
            </h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {{ user.kriteria || 'Tidak ada kriteria pasangan' }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <!-- Ban Form Input -->
        <div v-if="showBanForm && user" class="flex items-center gap-2 w-full sm:w-auto grow max-w-md">
          <UInput
            v-model="banReason"
            placeholder="Masukkan alasan tangguhkan..."
            :disabled="isSubmittingBan"
            class="grow"
            @keyup.enter="toggleBanStatus(true)"
          />
          <UButton
            color="error"
            :loading="isSubmittingBan"
            :disabled="!banReason.trim()"
            @click="toggleBanStatus(true)"
          >
            Ban
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="isSubmittingBan"
            @click="cancelBan"
          >
            Batal
          </UButton>
        </div>

        <div v-else-if="user" class="flex gap-2">
          <UButton
            v-if="user.banned"
            color="success"
            variant="subtle"
            icon="i-lucide-user-check"
            :loading="isSubmittingBan"
            @click="toggleBanStatus(false)"
          >
            Buka Tangguhan
          </UButton>
          <UButton
            v-else
            color="error"
            variant="subtle"
            icon="i-lucide-ban"
            @click="toggleBanStatus(true)"
          >
            Tangguhkan (Ban)
          </UButton>
        </div>

        <div v-if="!showBanForm" class="flex justify-end sm:ml-auto">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-x"
            @click="() => { openModel = false }"
          >
            Tutup
          </UButton>
        </div>
      </div>
    </template>
  </LazyUModal>
</template>

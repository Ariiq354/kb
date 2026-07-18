<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useAuthSession } from "~/composables/auth";
import { useToastError, useToastSuccess } from "~/composables/toast";

export interface MemberDetail {
  id: number;
  name: string | null;
  email: string | null;
  noTelepon: string | null;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  kodeUser: string | null;
  statusKawin: string | null;
  tanggalLahir: string | null;
  kelurahan: number | null;
  kelurahanNama: string | null;
  gender: "Laki-laki" | "Perempuan" | null;
  kecamatan: number | null;
  kecamatanNama: string | null;
  kota: number | null;
  kotaNama: string | null;
  provinsi: number | null;
  provinsiNama: string | null;
  namaAyah: string | null;
  anakKe: number | null;
  dariBersaudara: number | null;
  suku: string | null;
  pendidikan: string | null;
  pekerjaan: string | null;
  jurusan: string | null;
  tinggi: number | null;
  berat: number | null;
  hobi: string | null;
  instagram: string | null;
  kriteria: string | null;
  perokok: boolean | null;
  gaji: number | null;
  agama: string | null;
  deskripsi: string | null;
}

const props = defineProps<{
  member?: MemberDetail;
  memberId?: number;
  loading?: boolean;
}>();

const openModel = defineModel<boolean>();

const config = useRuntimeConfig();

const localMember = ref<MemberDetail | null>(null);
const localLoading = ref(false);

const isLoading = computed(() => props.loading || localLoading.value);
const activeMember = computed(() => props.member || localMember.value);

watch([() => openModel.value, () => props.memberId], async ([isOpen, id]) => {
  if (isOpen && id) {
    localLoading.value = true;
    localMember.value = null;
    try {
      const response = await $fetch<MemberDetail>(`/api/v1/users/${id}`);
      if (openModel.value) {
        localMember.value = response;
      }
    }
    catch (err: unknown) {
      if (openModel.value) {
        const errorDetails = err as { data?: { message?: string } };
        useToastError("Gagal Memuat Profil", errorDetails.data?.message || "Terjadi kesalahan.");
        openModel.value = false;
      }
    }
    finally {
      localLoading.value = false;
    }
  }
}, { immediate: true });

function calculateAge(birthDateString?: string | null) {
  if (!birthDateString)
    return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const formattedGaji = computed(() => {
  if (!activeMember.value?.gaji)
    return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(activeMember.value.gaji);
});

const { session } = await useAuthSession();
const showAjukanBtn = computed(() => session.value?.user.role === "user");
const isSubmitting = ref(false);

async function submitTaarufRequest() {
  if (!activeMember.value?.id)
    return;

  isSubmitting.value = true;
  try {
    await $fetch("/api/v1/taaruf", {
      method: "POST",
      body: { targetUserId: activeMember.value.id },
    });
    useToastSuccess("Pengajuan Berhasil", "Permintaan ta'aruf berhasil dikirim.");
    openModel.value = false;
  }
  catch (error: unknown) {
    const errorDetails = error as { data?: { message?: string } };
    useToastError("Pengajuan Gagal", errorDetails.data?.message || "Terjadi kesalahan.");
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <LazyUModal
    v-model:open="openModel"
    title="Detail Calon Pasangan"
    class="max-w-4xl"
  >
    <template #body>
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-6 overflow-y-auto max-h-[75vh] pr-2">
        <!-- Header Profile Banner Skeleton -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100 dark:border-gray-800">
          <USkeleton class="h-24 w-24 rounded-xl shrink-0" />
          <div class="space-y-3 flex-1 w-full">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <USkeleton class="h-8 w-48 sm:w-64" />
              <USkeleton class="h-6 w-24 rounded-full" />
            </div>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <USkeleton class="h-4 w-16" />
              <USkeleton class="h-4 w-20" />
              <USkeleton class="h-4 w-24" />
            </div>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              <USkeleton class="h-6 w-20 rounded-md" />
              <USkeleton class="h-6 w-24 rounded-md" />
              <USkeleton class="h-6 w-28 rounded-md" />
            </div>
          </div>
        </div>

        <!-- Deskripsi Diri Skeleton -->
        <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
          <div class="flex items-center gap-1.5">
            <USkeleton class="size-4 rounded-full" />
            <USkeleton class="h-4 w-24" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-5/6" />
          </div>
        </div>

        <!-- Details Grid Skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Profil Fisik & Keluarga Skeleton -->
          <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div class="flex items-center gap-2">
              <USkeleton class="size-5 rounded-full" />
              <USkeleton class="h-5 w-40" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="i in 5" :key="i" class="space-y-1">
                <USkeleton class="h-3 w-16" />
                <USkeleton class="h-4 w-24" />
              </div>
            </div>
          </div>

          <!-- Latar Belakang & Pekerjaan Skeleton -->
          <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div class="flex items-center gap-2">
              <USkeleton class="size-5 rounded-full" />
              <USkeleton class="h-5 w-48" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="i in 5" :key="i" class="space-y-1">
                <USkeleton class="h-3 w-16" />
                <USkeleton class="h-4 w-28" />
              </div>
            </div>
          </div>

          <!-- Kriteria Pasangan Skeleton -->
          <div class="col-span-1 md:col-span-2 bg-pink-50/30 dark:bg-pink-950/5 p-5 rounded-xl border border-pink-100/50 dark:border-pink-900/10 space-y-3">
            <div class="flex items-center gap-2">
              <USkeleton class="size-5 rounded-full" />
              <USkeleton class="h-5 w-52" />
            </div>
            <div class="space-y-2 pl-7">
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="activeMember" class="space-y-6 overflow-y-auto max-h-[75vh] pr-2">
        <!-- Header Profile Banner -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div class="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <NuxtImg
              :src="activeMember.image ? (activeMember.image.startsWith('http') ? activeMember.image : `${config.public.imageUrl}/${activeMember.image}`) : undefined"
              class="h-full w-full object-cover object-center"
              alt="Foto Calon"
            />
          </div>
          <div class="text-center sm:text-left space-y-2 flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white">
                {{ activeMember.name }}
              </h3>
              <span class="inline-flex self-center sm:self-auto bg-primary-50 dark:bg-primary-950/50 px-3 py-1 rounded-full text-xs font-bold text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/50">
                Kode: {{ activeMember.kodeUser }}
              </span>
            </div>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-sm text-gray-500">
              <span class="font-medium text-gray-700 dark:text-gray-300">{{ calculateAge(activeMember.tanggalLahir) }} Tahun</span>
              <span class="text-gray-300 dark:text-gray-700">•</span>
              <span>Suku {{ activeMember.suku }}</span>
              <span class="text-gray-300 dark:text-gray-700">•</span>
              <span>Agama {{ activeMember.agama }}</span>
            </div>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              <UBadge variant="subtle" color="primary">
                {{ activeMember.pendidikan }}
              </UBadge>
              <UBadge variant="subtle" color="neutral">
                {{ activeMember.statusKawin }}
              </UBadge>
              <UBadge variant="subtle" :color="activeMember.perokok ? 'error' : 'success'">
                {{ activeMember.perokok ? 'Perokok' : 'Tidak Merokok' }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Deskripsi Diri -->
        <div class="bg-linear-to-r from-primary-50/50 to-pink-50/20 dark:from-primary-950/10 dark:to-transparent p-5 rounded-xl border border-primary-100/50 dark:border-primary-900/20">
          <h4 class="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2 flex items-center gap-1.5">
            <UIcon name="i-lucide-quote" class="size-4 shrink-0" />
            Tentang Saya
          </h4>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
            "{{ activeMember.deskripsi || 'Belum diisi' }}"
          </p>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Profil Fisik & Keluarga -->
          <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h4 class="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-user" class="size-5 text-primary shrink-0" />
              Profil Fisik & Keluarga
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Tinggi Badan</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ activeMember.tinggi || '-' }} cm</span>
              </div>
              <div>
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Berat Badan</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ activeMember.berat || '-' }} kg</span>
              </div>
              <div>
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Anak Ke</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ activeMember.anakKe || '-' }} dari {{ activeMember.dariBersaudara || '-' }} bersaudara</span>
              </div>
              <div>
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Hobi</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ activeMember.hobi || '-' }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Nama Ayah</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ activeMember.namaAyah || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Latar Belakang & Pekerjaan -->
          <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h4 class="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-briefcase" class="size-5 text-primary shrink-0" />
              Pekerjaan & Pendidikan
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Pekerjaan</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ activeMember.pekerjaan || '-' }}</span>
              </div>
              <div>
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Jurusan</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ activeMember.jurusan || '-' }}</span>
              </div>
              <div>
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Pendidikan</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ activeMember.pendidikan || '-' }}</span>
              </div>
              <div>
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Estimasi Gaji</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formattedGaji }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-xs text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">Lokasi Asal</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ activeMember.kelurahanNama ? `${activeMember.kelurahanNama}, ` : '' }}
                  {{ activeMember.kecamatanNama ? `${activeMember.kecamatanNama}, ` : '' }}
                  {{ activeMember.kotaNama ? `${activeMember.kotaNama}, ` : '' }}
                  {{ activeMember.provinsiNama || '-' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Kriteria Pasangan -->
          <div class="col-span-1 md:col-span-2 bg-pink-50/30 dark:bg-pink-950/5 p-5 rounded-xl border border-pink-100/50 dark:border-pink-900/10 space-y-3">
            <h4 class="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-heart" class="size-5 text-pink-500 shrink-0" />
              Kriteria Pasangan Yang Dicari
            </h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
              {{ activeMember.kriteria || 'Belum diisi' }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton color="neutral" variant="subtle" @click="() => { openModel = false; }">
          Tutup
        </UButton>
        <UButton
          v-if="showAjukanBtn && activeMember"
          color="primary"
          icon="i-lucide-heart"
          :loading="isSubmitting"
          :disabled="isLoading"
          @click="submitTaarufRequest"
        >
          Ajukan Ta'aruf
        </UButton>
      </div>
    </template>
  </LazyUModal>
</template>

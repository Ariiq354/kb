<script setup lang="ts">
import { useAuthSession } from "~/composables/auth";

definePageMeta({
  layout: "dashboard",
});
useHead({
  title: "Ta'aruf",
});

const { session } = await useAuthSession();
const currentUserId = computed(() => session.value?.user?.id ? Number(session.value.user.id) : 0);

const page = ref(1);
const limit = ref(50); // Fetch more for client-side filtering

const { data: profilesData, pending: pendingProfiles } = useFetch("/api/v1/user-profile", {
  query: computed(() => ({
    page: page.value,
    limit: limit.value,
  })),
});

const { data: taarufData, pending: pendingTaaruf, refresh: refreshTaaruf } = useFetch("/api/v1/taaruf", {
  query: { page: 1, limit: 1000 },
});

const myProfile = computed(() => {
  return profilesData.value?.data?.find((p: any) => p.userId === currentUserId.value);
});

const lookingForGender = ref<"Laki-laki" | "Perempuan" | "">("");

watch(myProfile, (newProfile) => {
  if (newProfile && !lookingForGender.value) {
    lookingForGender.value = newProfile.gender === "Laki-laki" ? "Perempuan" : "Laki-laki";
  }
}, { immediate: true });

const activeStatuses = ["PENDING", "APPROVED", "PROFILE_EXCHANGE", "TAARUF"];

// Active processes count per user
const activeProcessCount = computed(() => {
  const counts: Record<number, number> = {};
  if (taarufData.value?.data) {
    taarufData.value.data.forEach((t: any) => {
      if (activeStatuses.includes(t.status)) {
        counts[t.requesterUserId] = (counts[t.requesterUserId] || 0) + 1;
        counts[t.targetUserId] = (counts[t.targetUserId] || 0) + 1;
      }
    });
  }
  return counts;
});

const eligiblePartners = computed(() => {
  if (!profilesData.value?.data)
    return [];
  return profilesData.value.data.filter((p: any) => {
    // Exclude self
    if (p.userId === currentUserId.value)
      return false;

    // Match opposite gender
    if (lookingForGender.value && p.gender !== lookingForGender.value)
      return false;

    // < 3 active processes
    const counts = activeProcessCount.value[p.userId] || 0;
    if (counts >= 3)
      return false;

    return true;
  });
});

const myActiveTaarufs = computed(() => {
  if (!taarufData.value?.data)
    return [];
  return taarufData.value.data.filter((t: any) =>
    t.requesterUserId === currentUserId.value || t.targetUserId === currentUserId.value,
  );
});

function getAge(birthDate: string) {
  if (!birthDate)
    return "?";
  const diff = Date.now() - new Date(birthDate).getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return age;
}

const toast = useToast();
const isSubmitting = ref(false);

async function initiateTaaruf(targetUserId: number) {
  if (!currentUserId.value) {
    toast.add({ title: "You must be logged in", color: "red" });
    return;
  }

  if (confirm("Apakah Anda yakin ingin mengajukan Ta'aruf dengan user ini?")) {
    isSubmitting.value = true;
    try {
      await $fetch("/api/v1/taaruf", {
        method: "POST",
        body: {
          requesterUserId: currentUserId.value,
          targetUserId,
        },
      });
      toast.add({ title: "Pengajuan Ta'aruf berhasil dikirim", color: "green" });
      refreshTaaruf();
    }
    catch (err: any) {
      toast.add({ title: "Gagal mengajukan Ta'aruf", description: err.data?.message || err.message, color: "red" });
    }
    finally {
      isSubmitting.value = false;
    }
  }
}

const columns = [
  { key: "id", label: "ID" },
  { key: "role", label: "Role" },
  { key: "partnerId", label: "Partner ID" },
  { key: "status", label: "Status" },
  { key: "startedAt", label: "Started At" },
];

const getRoleText = (t: any) => t.requesterUserId === currentUserId.value ? "Pengaju" : "Penerima";
const getPartnerId = (t: any) => t.requesterUserId === currentUserId.value ? t.targetUserId : t.requesterUserId;
</script>

<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Cari Jodoh (Ta'aruf)
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Temukan pasangan hidup yang sesuai dengan kriteria Anda.
        </p>
      </div>
    </div>

    <!-- Active Processes -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">
          Proses Ta'aruf Saya
        </h2>
      </template>
      <UTable
        :columns="columns"
        :rows="myActiveTaarufs"
        :loading="pendingTaaruf"
        empty-state="Belum ada proses Ta'aruf yang aktif."
      >
        <template #role-data="{ row }">
          <UBadge :color="row.requesterUserId === currentUserId ? 'blue' : 'purple'" variant="soft">
            {{ getRoleText(row) }}
          </UBadge>
        </template>
        <template #partnerId-data="{ row }">
          User #{{ getPartnerId(row) }}
        </template>
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'MARRIED' ? 'green' : row.status === 'REJECTED' || row.status === 'CANCELLED' ? 'red' : 'primary'">
            {{ row.status }}
          </UBadge>
        </template>
      </UTable>
    </UCard>

    <!-- Eligible Partners -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Rekomendasi Pasangan
          </h2>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Mencari:</span>
            <USelectMenu v-model="lookingForGender" :options="['Laki-laki', 'Perempuan']" class="w-32" />
          </div>
        </div>
      </template>

      <div v-if="pendingProfiles || pendingTaaruf" class="flex justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
      </div>

      <div v-else-if="eligiblePartners.length === 0" class="text-center py-8 text-gray-500">
        Belum ada kandidat yang memenuhi kriteria saat ini.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="partner in eligiblePartners" :key="partner.id" class="flex flex-col">
          <div class="flex items-center gap-4 mb-4">
            <UAvatar :src="partner.foto" :alt="partner.kodeUser" size="lg" />
            <div>
              <h3 class="font-bold text-lg">
                {{ partner.kodeUser }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ getAge(partner.tanggalLahir) }} tahun • {{ partner.kota }}
              </p>
            </div>
          </div>
          <div class="space-y-2 text-sm flex-1">
            <div class="flex justify-between">
              <span class="text-gray-500">Pendidikan:</span>
              <span class="font-medium text-right">{{ partner.pendidikan }} {{ partner.jurusan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Pekerjaan:</span>
              <span class="font-medium text-right">{{ partner.pekerjaan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Status:</span>
              <span class="font-medium text-right">{{ partner.statusKawin }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Fisik:</span>
              <span class="font-medium text-right">{{ partner.tinggi }}cm / {{ partner.berat }}kg</span>
            </div>
            <div class="mt-4 pt-4 border-t">
              <p class="text-gray-600 dark:text-gray-300 line-clamp-3">
                "{{ partner.deskripsi }}"
              </p>
            </div>
          </div>
          <template #footer>
            <UButton
              color="primary"
              block
              :loading="isSubmitting"
              @click="initiateTaaruf(partner.userId)"
            >
              Ajukan Ta'aruf
            </UButton>
          </template>
        </UCard>
      </div>

      <div class="flex justify-center mt-6">
        <UPagination
          v-if="profilesData?.total && profilesData.total > limit"
          v-model="page"
          :page-count="limit"
          :total="profilesData.total"
        />
      </div>
    </UCard>
  </div>
</template>

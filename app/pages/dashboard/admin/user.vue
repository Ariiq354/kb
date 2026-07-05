<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
useHead({
  title: "Kelola User Profile",
});

const page = ref(1);
const limit = ref(10);
const search = ref("");
const genderFilter = ref("");

const genders = ["Laki-laki", "Perempuan"];

const { data: profilesData, pending, refresh } = useFetch("/api/v1/user-profile", {
  query: computed(() => ({
    page: page.value,
    limit: limit.value,
    ...(search.value ? { search: search.value } : {}),
    ...(genderFilter.value ? { gender: genderFilter.value } : {}),
  })),
});

const columns = [
  { key: "id", label: "ID" },
  { key: "foto", label: "Foto" },
  { key: "kodeUser", label: "Kode User" },
  { key: "userId", label: "User ID" },
  { key: "gender", label: "Gender" },
  { key: "kota", label: "Kota" },
  { key: "pekerjaan", label: "Pekerjaan" },
  { key: "actions", label: "Actions" },
];

const toast = useToast();
const isModalOpen = ref(false);
const isEdit = ref(false);
const selectedId = ref<number | null>(null);
const isSubmitting = ref(false);

function initialFormState() {
  return {
    kodeUser: "",
    userId: "",
    statusKawin: "",
    tanggalLahir: "",
    kelurahan: "",
    gender: "Laki-laki",
    kecamatan: "",
    kota: "",
    provinsi: "",
    namaAyah: "",
    anakKe: 1,
    dariBersaudara: 1,
    suku: "",
    pendidikan: "",
    pekerjaan: "",
    jurusan: "",
    tinggi: 160,
    berat: 60,
    hobi: "",
    instagram: "",
    kriteria: "",
    perokok: false,
    gaji: 0,
    agama: "",
    deskripsi: "",
  };
}

const formState = reactive(initialFormState());
const fileInput = ref<File | null>(null);

function openCreateModal() {
  isEdit.value = false;
  Object.assign(formState, initialFormState());
  fileInput.value = null;
  selectedId.value = null;
  isModalOpen.value = true;
}

function openEditModal(row: any) {
  isEdit.value = true;
  selectedId.value = row.id;
  Object.assign(formState, {
    kodeUser: row.kodeUser,
    userId: row.userId.toString(),
    statusKawin: row.statusKawin,
    tanggalLahir: row.tanggalLahir,
    kelurahan: row.kelurahan,
    gender: row.gender,
    kecamatan: row.kecamatan,
    kota: row.kota,
    provinsi: row.provinsi,
    namaAyah: row.namaAyah,
    anakKe: row.anakKe,
    dariBersaudara: row.dariBersaudara,
    suku: row.suku,
    pendidikan: row.pendidikan,
    pekerjaan: row.pekerjaan,
    jurusan: row.jurusan,
    tinggi: row.tinggi,
    berat: row.berat,
    hobi: row.hobi,
    instagram: row.instagram,
    kriteria: row.kriteria,
    perokok: row.perokok,
    gaji: row.gaji,
    agama: row.agama,
    deskripsi: row.deskripsi,
  });
  fileInput.value = null;
  isModalOpen.value = true;
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    fileInput.value = target.files[0];
  }
}

async function submitForm() {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (fileInput.value) {
      formData.append("file", fileInput.value);
    }

    if (isEdit.value && selectedId.value) {
      await $fetch(`/api/v1/user-profile/${selectedId.value}`, {
        method: "PATCH",
        body: formData,
      });
      toast.add({ title: "Profile updated successfully", color: "green" });
    }
    else {
      await $fetch("/api/v1/user-profile", {
        method: "POST",
        body: formData,
      });
      toast.add({ title: "Profile created successfully", color: "green" });
    }
    isModalOpen.value = false;
    refresh();
  }
  catch (err: any) {
    toast.add({ title: "Error saving profile", description: err.data?.message || err.message, color: "red" });
  }
  finally {
    isSubmitting.value = false;
  }
}

async function deleteItem(id: number) {
  if (!confirm("Are you sure you want to delete this profile?"))
    return;
  try {
    await $fetch(`/api/v1/user-profile/${id}`, { method: "DELETE" });
    toast.add({ title: "Profile deleted successfully", color: "green" });
    refresh();
  }
  catch (err: any) {
    toast.add({ title: "Error deleting profile", description: err.data?.message || err.message, color: "red" });
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Kelola User Profile
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Manage user profiles and details.
        </p>
      </div>
      <UButton icon="i-heroicons-plus" color="primary" @click="openCreateModal">
        Create Profile
      </UButton>
    </div>

    <UCard>
      <div class="flex items-center gap-4 mb-4">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search Kode User..."
          class="w-64"
        />
        <USelectMenu
          v-model="genderFilter"
          :options="genders"
          placeholder="Filter by Gender"
          clearable
          class="w-48"
        />
      </div>

      <UTable
        :columns="columns"
        :rows="profilesData?.data || []"
        :loading="pending"
      >
        <template #foto-data="{ row }">
          <UAvatar :src="row.foto" :alt="row.kodeUser" size="sm" />
        </template>
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton size="xs" color="blue" variant="ghost" icon="i-heroicons-pencil-square" @click="openEditModal(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="deleteItem(row.id)" />
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination
          v-if="profilesData?.total"
          v-model="page"
          :page-count="limit"
          :total="profilesData.total"
        />
      </div>
    </UCard>

    <UModal v-model="isModalOpen" :ui="{ width: 'w-full sm:max-w-4xl' }">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ isEdit ? 'Edit Profile' : 'Create Profile' }}
          </h3>
        </template>

        <form class="space-y-4 max-h-[70vh] overflow-y-auto px-1" @submit.prevent="submitForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Kode User" required>
              <UInput v-model="formState.kodeUser" />
            </UFormGroup>
            <UFormGroup label="User ID" required>
              <UInput v-model="formState.userId" type="number" />
            </UFormGroup>
            <UFormGroup label="Status Kawin" required>
              <UInput v-model="formState.statusKawin" />
            </UFormGroup>
            <UFormGroup label="Tanggal Lahir" required>
              <UInput v-model="formState.tanggalLahir" type="date" />
            </UFormGroup>
            <UFormGroup label="Gender" required>
              <USelectMenu v-model="formState.gender" :options="genders" />
            </UFormGroup>
            <UFormGroup label="Agama">
              <UInput v-model="formState.agama" />
            </UFormGroup>

            <div class="md:col-span-2">
              <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                Lokasi
              </h4>
            </div>
            <UFormGroup label="Provinsi" required>
              <UInput v-model="formState.provinsi" />
            </UFormGroup>
            <UFormGroup label="Kota" required>
              <UInput v-model="formState.kota" />
            </UFormGroup>
            <UFormGroup label="Kecamatan" required>
              <UInput v-model="formState.kecamatan" />
            </UFormGroup>
            <UFormGroup label="Kelurahan" required>
              <UInput v-model="formState.kelurahan" />
            </UFormGroup>

            <div class="md:col-span-2">
              <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                Keluarga & Fisik
              </h4>
            </div>
            <UFormGroup label="Nama Ayah" required>
              <UInput v-model="formState.namaAyah" />
            </UFormGroup>
            <div class="flex gap-2">
              <UFormGroup label="Anak Ke" class="flex-1" required>
                <UInput v-model="formState.anakKe" type="number" />
              </UFormGroup>
              <UFormGroup label="Dari Bersaudara" class="flex-1" required>
                <UInput v-model="formState.dariBersaudara" type="number" />
              </UFormGroup>
            </div>
            <UFormGroup label="Suku" required>
              <UInput v-model="formState.suku" />
            </UFormGroup>
            <div class="flex gap-2">
              <UFormGroup label="Tinggi (cm)" class="flex-1" required>
                <UInput v-model="formState.tinggi" type="number" />
              </UFormGroup>
              <UFormGroup label="Berat (kg)" class="flex-1" required>
                <UInput v-model="formState.berat" type="number" />
              </UFormGroup>
            </div>

            <div class="md:col-span-2">
              <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                Pendidikan, Pekerjaan, & Lainnya
              </h4>
            </div>
            <UFormGroup label="Pendidikan" required>
              <UInput v-model="formState.pendidikan" />
            </UFormGroup>
            <UFormGroup label="Jurusan" required>
              <UInput v-model="formState.jurusan" />
            </UFormGroup>
            <UFormGroup label="Pekerjaan" required>
              <UInput v-model="formState.pekerjaan" />
            </UFormGroup>
            <UFormGroup label="Gaji">
              <UInput v-model="formState.gaji" type="number" />
            </UFormGroup>
            <UFormGroup label="Hobi" required>
              <UInput v-model="formState.hobi" />
            </UFormGroup>
            <UFormGroup label="Instagram" required>
              <UInput v-model="formState.instagram" />
            </UFormGroup>
            <UFormGroup label="Perokok">
              <UCheckbox v-model="formState.perokok" label="Ya, perokok" />
            </UFormGroup>

            <div class="md:col-span-2">
              <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                Deskripsi & Kriteria
              </h4>
            </div>
            <UFormGroup label="Deskripsi Diri" class="md:col-span-2">
              <UTextarea v-model="formState.deskripsi" />
            </UFormGroup>
            <UFormGroup label="Kriteria Pasangan" required class="md:col-span-2">
              <UTextarea v-model="formState.kriteria" />
            </UFormGroup>
            <UFormGroup label="Foto Profile" :required="!isEdit" class="md:col-span-2">
              <input type="file" accept="image/jpeg,image/png,image/webp" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-400" @change="handleFileChange">
            </UFormGroup>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="isModalOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" :loading="isSubmitting" @click="submitForm">
              Save
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

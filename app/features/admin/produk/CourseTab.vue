<script setup lang="ts">
import { reactive, ref } from "vue";

const page = ref(1);
const limit = ref(10);
const search = ref("");

const { data, pending, refresh } = useFetch("/api/v1/course", {
  query: { page, limit, search },
  watch: [page, limit, search],
});

const columns = [
  { key: "id", label: "ID" },
  { key: "produk.judul", label: "Judul" },
  { key: "namaPublisher", label: "Publisher" },
  { key: "produk.harga", label: "Harga" },
  { key: "produk.status", label: "Status" },
  { key: "actions", label: "Aksi" },
];

const isModalOpen = ref(false);
const modalMode = ref<"create" | "edit">("create");
const selectedId = ref<number | null>(null);
const selectedFile = ref<File | null>(null);
const isSubmitting = ref(false);

const initialState = {
  judul: "",
  harga: 0,
  status: true,
  deskripsi: "",
  namaPublisher: "",
};

const state = reactive({ ...initialState });

function openCreate() {
  modalMode.value = "create";
  selectedId.value = null;
  selectedFile.value = null;
  Object.assign(state, initialState);
  isModalOpen.value = true;
}

function openEdit(row: any) {
  modalMode.value = "edit";
  selectedId.value = row.id;
  selectedFile.value = null;
  Object.assign(state, {
    judul: row.produk.judul,
    harga: row.produk.harga,
    status: row.produk.status,
    deskripsi: row.deskripsi || "",
    namaPublisher: row.namaPublisher || "",
  });
  isModalOpen.value = true;
}

const toast = useToast();

async function submit() {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append("judul", state.judul);
    formData.append("harga", state.harga.toString());
    formData.append("status", state.status ? "true" : "");
    if (state.deskripsi)
      formData.append("deskripsi", state.deskripsi);
    if (state.namaPublisher)
      formData.append("namaPublisher", state.namaPublisher);

    if (selectedFile.value) {
      formData.append("file", selectedFile.value);
    }

    if (modalMode.value === "create") {
      await $fetch("/api/v1/course", {
        method: "POST",
        body: formData,
      });
      toast.add({ title: "Berhasil", description: "Course berhasil dibuat", color: "green" });
    }
    else {
      await $fetch(`/api/v1/course/${selectedId.value}`, {
        method: "PATCH",
        body: formData,
      });
      toast.add({ title: "Berhasil", description: "Course berhasil diupdate", color: "green" });
    }
    isModalOpen.value = false;
    refresh();
  }
  catch (err: any) {
    toast.add({ title: "Error", description: err.data?.message || err.message, color: "red" });
  }
  finally {
    isSubmitting.value = false;
  }
}

async function deleteItem(id: number) {
  if (!confirm("Yakin ingin menghapus?"))
    return;
  try {
    await $fetch("/api/v1/course", {
      method: "DELETE",
      query: { ids: [id] },
    });
    toast.add({ title: "Berhasil", description: "Course dihapus", color: "green" });
    refresh();
  }
  catch (err: any) {
    toast.add({ title: "Error", description: err.data?.message || err.message, color: "red" });
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="w-1/3">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Cari..." />
      </div>
      <UButton icon="i-heroicons-plus" @click="openCreate">
        Tambah Course
      </UButton>
    </div>

    <UCard>
      <UTable :rows="data?.data || []" :columns="columns" :loading="pending">
        <template #produk.harga-data="{ row }">
          Rp {{ row.produk.harga.toLocaleString('id-ID') }}
        </template>
        <template #produk.status-data="{ row }">
          <UBadge :color="row.produk.status ? 'green' : 'red'">
            {{ row.produk.status ? 'Aktif' : 'Nonaktif' }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="blue" icon="i-heroicons-pencil-square" @click="openEdit(row)" />
            <UButton size="xs" color="red" icon="i-heroicons-trash" @click="deleteItem(row.id)" />
          </div>
        </template>
      </UTable>

      <div v-if="data?.total !== undefined" class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="limit" :total="data.total" />
      </div>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard>
        <template #header>
          <div class="text-xl font-semibold">
            {{ modalMode === 'create' ? 'Tambah' : 'Edit' }} Course
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="submit">
          <UFormGroup label="Judul" required>
            <UInput v-model="state.judul" required />
          </UFormGroup>
          <UFormGroup label="Harga" required>
            <UInput v-model="state.harga" type="number" required />
          </UFormGroup>
          <UFormGroup label="Nama Publisher">
            <UInput v-model="state.namaPublisher" />
          </UFormGroup>
          <UFormGroup label="Deskripsi">
            <UTextarea v-model="state.deskripsi" />
          </UFormGroup>
          <UFormGroup label="Status">
            <UToggle v-model="state.status" />
          </UFormGroup>

          <UFormGroup label="Cover / Foto Course" :required="modalMode === 'create'">
            <input type="file" accept="image/jpeg,image/png,image/webp" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" @change="e => selectedFile = (e.target as HTMLInputElement).files?.[0] || null">
            <div v-if="modalMode === 'edit' && !selectedFile" class="text-xs text-gray-500 mt-1">
              Kosongkan jika tidak ingin mengubah cover.
            </div>
          </UFormGroup>

          <div class="flex justify-end gap-2 mt-4">
            <UButton color="gray" variant="soft" @click="isModalOpen = false">
              Batal
            </UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting">
              Simpan
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

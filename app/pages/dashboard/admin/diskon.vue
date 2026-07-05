<script setup lang="ts">
import { reactive, ref } from "vue";

definePageMeta({
  layout: "dashboard",
});

const page = ref(1);
const limit = ref(10);
const search = ref("");

const { data, pending, refresh } = useFetch("/api/v1/diskon", {
  query: { page, limit, search },
  watch: [page, limit, search],
});

const columns = [
  { key: "id", label: "ID" },
  { key: "kode", label: "Kode Diskon" },
  { key: "persen", label: "Diskon (%)" },
  { key: "batasWaktu", label: "Batas Waktu" },
  { key: "pemakaian", label: "Pemakaian" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Aksi" },
];

const isModalOpen = ref(false);
const modalMode = ref<"create" | "edit">("create");
const selectedId = ref<number | null>(null);
const isSubmitting = ref(false);

const initialState = {
  kode: "",
  persen: 0,
  batasWaktu: "",
  batasPemakai: 1,
  status: true,
};

const state = reactive({ ...initialState });

function openCreate() {
  modalMode.value = "create";
  selectedId.value = null;
  Object.assign(state, initialState);
  isModalOpen.value = true;
}

function openEdit(row: any) {
  modalMode.value = "edit";
  selectedId.value = row.id;
  Object.assign(state, {
    kode: row.kode,
    persen: row.persen,
    batasWaktu: row.batasWaktu,
    batasPemakai: row.batasPemakai,
    status: row.status,
  });
  isModalOpen.value = true;
}

const toast = useToast();

async function submit() {
  isSubmitting.value = true;
  try {
    const payload = {
      ...state,
      persen: Number(state.persen),
      batasPemakai: Number(state.batasPemakai),
    };

    if (modalMode.value === "create") {
      await $fetch("/api/v1/diskon", {
        method: "POST",
        body: payload,
      });
      toast.add({ title: "Berhasil", description: "Diskon berhasil dibuat", color: "green" });
    }
    else {
      await $fetch(`/api/v1/diskon/${selectedId.value}`, {
        method: "PATCH",
        body: payload,
      });
      toast.add({ title: "Berhasil", description: "Diskon berhasil diupdate", color: "green" });
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
    await $fetch("/api/v1/diskon", {
      method: "DELETE",
      query: { ids: [id] },
    });
    toast.add({ title: "Berhasil", description: "Diskon dihapus", color: "green" });
    refresh();
  }
  catch (err: any) {
    toast.add({ title: "Error", description: err.data?.message || err.message, color: "red" });
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">
      Manajemen Diskon
    </h1>

    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <div class="w-1/3">
          <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Cari..." />
        </div>
        <UButton icon="i-heroicons-plus" @click="openCreate">
          Tambah Diskon
        </UButton>
      </div>

      <UCard>
        <UTable :rows="data?.data || []" :columns="columns" :loading="pending">
          <template #pemakaian-data="{ row }">
            {{ row.jumlahDipakai }} / {{ row.batasPemakai }}
          </template>
          <template #status-data="{ row }">
            <UBadge :color="row.status ? 'green' : 'red'">
              {{ row.status ? 'Aktif' : 'Nonaktif' }}
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
              {{ modalMode === 'create' ? 'Tambah' : 'Edit' }} Diskon
            </div>
          </template>

          <form class="space-y-4" @submit.prevent="submit">
            <UFormGroup label="Kode Diskon" required>
              <UInput v-model="state.kode" required class="uppercase" />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Persen (%)" required>
                <UInput v-model="state.persen" type="number" required min="0" max="100" />
              </UFormGroup>
              <UFormGroup label="Batas Pemakai" required>
                <UInput v-model="state.batasPemakai" type="number" required min="1" />
              </UFormGroup>
            </div>

            <UFormGroup label="Batas Waktu" required>
              <UInput v-model="state.batasWaktu" type="date" required />
            </UFormGroup>

            <UFormGroup label="Status">
              <UToggle v-model="state.status" />
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
  </div>
</template>

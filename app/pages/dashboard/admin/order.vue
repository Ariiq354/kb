<script setup lang="ts">
import { reactive, ref } from "vue";

definePageMeta({
  layout: "dashboard",
});

const page = ref(1);
const limit = ref(10);
const search = ref("");

const { data, pending, refresh } = useFetch("/api/v1/orders", {
  query: { page, limit, search },
  watch: [page, limit, search],
});

const columns = [
  { key: "id", label: "ID" },
  { key: "user.name", label: "Pembeli" },
  { key: "produk.judul", label: "Produk" },
  { key: "originalHarga", label: "Harga Awal" },
  { key: "diskonPersen", label: "Diskon" },
  { key: "finalHarga", label: "Harga Akhir" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Aksi" },
];

const isModalOpen = ref(false);
const selectedId = ref<number | null>(null);
const isSubmitting = ref(false);

const state = reactive({
  status: "PENDING_PAYMENT" as "PENDING_PAYMENT" | "WAITING_VERIFICATION" | "PAID",
});

function openEdit(row: any) {
  selectedId.value = row.id;
  state.status = row.status;
  isModalOpen.value = true;
}

const toast = useToast();

async function submit() {
  if (!selectedId.value)
    return;
  isSubmitting.value = true;
  try {
    await $fetch(`/api/v1/orders/${selectedId.value}`, {
      method: "PATCH",
      body: { status: state.status },
    });
    toast.add({ title: "Berhasil", description: "Status order berhasil diupdate", color: "green" });
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
    await $fetch("/api/v1/orders", {
      method: "DELETE",
      query: { ids: [id] },
    });
    toast.add({ title: "Berhasil", description: "Order dihapus", color: "green" });
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
      Manajemen Order
    </h1>

    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <div class="w-1/3">
          <!-- Currently backend might not support search for orders based on the repo.ts, but let's keep the UI standard -->
          <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Cari..." />
        </div>
      </div>

      <UCard>
        <UTable :rows="data?.data || []" :columns="columns" :loading="pending">
          <template #user.name-data="{ row }">
            <div>
              <div class="font-medium">
                {{ row.user?.name || '-' }}
              </div>
              <div class="text-xs text-gray-500">
                {{ row.user?.email || '-' }}
              </div>
            </div>
          </template>

          <template #produk.judul-data="{ row }">
            <div class="font-medium">
              {{ row.produk?.judul || '-' }}
            </div>
          </template>

          <template #originalHarga-data="{ row }">
            Rp {{ row.originalHarga.toLocaleString('id-ID') }}
          </template>

          <template #diskonPersen-data="{ row }">
            {{ row.diskonPersen }}%
          </template>

          <template #finalHarga-data="{ row }">
            Rp {{ row.finalHarga.toLocaleString('id-ID') }}
          </template>

          <template #status-data="{ row }">
            <UBadge :color="row.status === 'PAID' ? 'green' : row.status === 'WAITING_VERIFICATION' ? 'yellow' : 'red'">
              {{ row.status }}
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
              Update Status Order
            </div>
          </template>

          <form class="space-y-4" @submit.prevent="submit">
            <UFormGroup label="Status">
              <USelectMenu
                v-model="state.status"
                :options="['PENDING_PAYMENT', 'WAITING_VERIFICATION', 'PAID']"
              />
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

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
useHead({
  title: "Kelola Ta'aruf",
});

const page = ref(1);
const limit = ref(10);
const statusFilter = ref("");

const statuses = [
  "PENDING",
  "APPROVED",
  "PROFILE_EXCHANGE",
  "TAARUF",
  "REJECTED",
  "CANCELLED",
  "MARRIED",
];

const { data: taarufData, pending, refresh } = useFetch("/api/v1/taaruf", {
  query: computed(() => ({
    page: page.value,
    limit: limit.value,
    ...(statusFilter.value ? { status: statusFilter.value } : {}),
  })),
});

const columns = [
  { key: "id", label: "ID" },
  { key: "requesterUserId", label: "Requester User ID" },
  { key: "targetUserId", label: "Target User ID" },
  { key: "status", label: "Status" },
  { key: "startedAt", label: "Started At" },
  { key: "actions", label: "Actions" },
];

const toast = useToast();
const isModalOpen = ref(false);
const selectedTaaruf = ref<any>(null);
const formState = reactive({
  status: "",
  keterangan: "",
});

function openUpdateModal(row: any) {
  selectedTaaruf.value = row;
  formState.status = row.status;
  formState.keterangan = "";
  isModalOpen.value = true;
}

const isUpdating = ref(false);
async function updateStatus() {
  if (!selectedTaaruf.value)
    return;
  isUpdating.value = true;
  try {
    await $fetch(`/api/v1/taaruf/${selectedTaaruf.value.id}`, {
      method: "PATCH",
      body: {
        status: formState.status,
        keterangan: formState.keterangan,
      },
    });
    toast.add({ title: "Status updated successfully", color: "green" });
    isModalOpen.value = false;
    refresh();
  }
  catch (err: any) {
    toast.add({ title: "Error updating status", description: err.data?.message || err.message, color: "red" });
  }
  finally {
    isUpdating.value = false;
  }
}

async function deleteItem(id: number) {
  if (!confirm("Are you sure you want to delete this process?"))
    return;
  try {
    await $fetch(`/api/v1/taaruf/${id}`, { method: "DELETE" });
    toast.add({ title: "Deleted successfully", color: "green" });
    refresh();
  }
  catch (err: any) {
    toast.add({ title: "Error deleting", description: err.data?.message || err.message, color: "red" });
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Kelola Ta'aruf
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Manage ta'aruf submissions and processes.
        </p>
      </div>
    </div>

    <UCard>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <USelectMenu
            v-model="statusFilter"
            :options="statuses"
            placeholder="Filter by Status"
            clearable
            class="w-48"
          />
        </div>
      </div>

      <UTable
        :columns="columns"
        :rows="taarufData?.data || []"
        :loading="pending"
      >
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'MARRIED' ? 'green' : row.status === 'REJECTED' ? 'red' : 'primary'">
            {{ row.status }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton size="xs" color="blue" variant="ghost" icon="i-heroicons-pencil-square" @click="openUpdateModal(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="deleteItem(row.id)" />
          </div>
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination
          v-if="taarufData?.total"
          v-model="page"
          :page-count="limit"
          :total="taarufData.total"
        />
      </div>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            Update Status
          </h3>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Status" name="status">
            <USelectMenu v-model="formState.status" :options="statuses" />
          </UFormGroup>
          <UFormGroup label="Keterangan (Optional)" name="keterangan">
            <UTextarea v-model="formState.keterangan" placeholder="Alasan update status..." />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="isModalOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" :loading="isUpdating" @click="updateStatus">
              Update
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

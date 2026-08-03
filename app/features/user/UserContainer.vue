<script setup lang="ts">
import type { SerializedUser } from "./constants";
import type { PageSearch } from "~/utils/types";
import { ref } from "vue";
import DataTable from "~/components/Custom/DataTable.vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import { ObjectAssign } from "~/utils";
import UserDetailModal from "./components/UserDetailModal.vue";
import { columns } from "./constants";

const query = ref<PageSearch>({ page: 1 });
const { data, status, refresh } = await useFetch("/api/v1/users", {
  query,
});

const detailModalOpen = ref(false);
const selectedUser = ref<SerializedUser | null>(null);

function clickDetail(item: SerializedUser) {
  selectedUser.value = item;
  detailModalOpen.value = true;
}

async function handleSuccess() {
  await refresh();
  if (selectedUser.value) {
    const updated = data.value?.data.find(u => u.id === selectedUser.value?.id);
    if (updated) {
      selectedUser.value = updated;
    }
    else {
      detailModalOpen.value = false;
    }
  }
}
</script>

<template>
  <section class="space-y-5">
    <UserDetailModal
      v-model:open="detailModalOpen"
      :user="selectedUser"
      @success="handleSuccess"
    />

    <header class="flex flex-col gap-3 border-b border-muted pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-primary">
          <UIcon name="i-lucide-users-round" class="size-4" />
          <span class="text-xs font-semibold tracking-[0.16em] uppercase">Manajemen anggota</span>
        </div>
        <h1 class="text-2xl font-semibold tracking-tight text-highlighted">
          Daftar anggota
        </h1>
        <p class="text-sm text-muted">
          Tinjau profil dan status anggota dalam satu tempat.
        </p>
      </div>

      <div class="flex items-center gap-2 self-start rounded-full bg-elevated px-3 py-1.5 text-sm text-muted sm:self-auto">
        <span class="size-2 rounded-full bg-success" />
        {{ data?.total ?? 0 }} anggota
      </div>
    </header>

    <UCard
      class="overflow-hidden"
      :ui="{ body: 'p-0 sm:p-0' }"
    >
      <template #header>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="font-semibold text-highlighted">
              Direktori anggota
            </h2>
            <p class="mt-0.5 text-sm text-muted">
              Gunakan pencarian untuk menemukan anggota dengan cepat.
            </p>
          </div>
          <InputSearch
            :model-value="query.search"
            class="w-full sm:max-w-xs"
            @update:model-value="ObjectAssign(query, { search: $event, page: 1 })"
          />
        </div>
      </template>

      <div class="p-3 sm:p-5">
        <DataTable
          v-model:page="query.page"
          :data="data?.data ?? []"
          :columns="columns"
          :total="data?.total ?? 0"
          :loading="status === 'pending'"
          enumerate
          pagination
          viewable
          @view="clickDetail"
        />
      </div>
    </UCard>
  </section>
</template>

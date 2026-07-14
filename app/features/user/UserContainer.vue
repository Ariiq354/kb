<script setup lang="ts">
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
const selectedUser = ref<any>(null);

function clickDetail(item: any) {
  selectedUser.value = item;
  detailModalOpen.value = true;
}

async function handleSuccess() {
  await refresh();
  if (selectedUser.value) {
    const updated = data.value?.data.find((u: any) => u.id === selectedUser.value.id);
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
  <div class="space-y-6">
    <UserDetailModal
      v-model:open="detailModalOpen"
      :user="selectedUser"
      @success="handleSuccess"
    />

    <UCard>
      <div class="mb-6 flex gap-2 md:gap-4">
        <InputSearch
          :model-value="query.search"
          class="w-full"
          @update:model-value="ObjectAssign(query, { search: $event, page: 1 })"
        />
      </div>

      <!-- Member Data Table -->
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
    </UCard>
  </div>
</template>

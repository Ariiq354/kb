<script setup lang="ts">
import type { Ref } from "vue";
import type { Schema } from "./constants";
import type { ExtractFetchData, PageSearch } from "~/utils/types";
import DataTable from "~/components/Custom/DataTable.vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import { openModal } from "~/composables/modal";
import { ObjectAssign } from "~/utils";
import CreateModal from "./components/CreateModal.vue";
import { columns, initFormData } from "./constants";

const modalOpen = ref(false);
const filterModal = ref(false);

const state = ref(initFormData) as Ref<Schema>;

const query = ref<PageSearch>({ page: 1 });
const { data, status, refresh } = await useFetch("/api/v1/course", {
  query,
});

function clickAdd() {
  state.value = { ...initFormData };
  modalOpen.value = true;
}

function clickEdit(item: ExtractFetchData<typeof data>[number]) {
  state.value = {
    id: item.id,
    judul: item.judul,
    harga: item.harga,
    status: item.status,
    deskripsi: item.deskripsi ?? "",
    namaPublisher: item.namaPublisher ?? "",
    foto: item.foto ?? undefined,
    file: undefined,
  };
  modalOpen.value = true;
}

async function clickDelete(ids: number[]) {
  openModal(ModalConfirm, { path: "/api/v1/course", body: { ids }, refresh });
}

function getDropdownItems(row: any) {
  return [
    {
      label: "Kelola Kurikulum",
      icon: "i-lucide-book-open",
      async onSelect() {
        await navigateTo(`/dashboard/admin/produk/course/${row.id}`);
      },
    },
  ];
}
</script>

<template>
  <CreateModal
    v-model:open="modalOpen"
    v-model:state="state"
    @submit="refresh"
  />
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch
        :model-value="query.search"
        @update:model-value="ObjectAssign(query, { search: $event, page: 1 })"
      />
      <UButton
        variant="subtle"
        icon="i-lucide-filter"
        class="md:hidden"
        @click="() => { filterModal = true }"
      />
      <UButton
        icon="i-lucide-plus"
        class="text-white dark:bg-blue-600 hover:dark:bg-blue-600/75"
        @click="clickAdd"
      >
        <p class="hidden md:block">
          Tambah
        </p>
      </UButton>
    </div>

    <DataTable
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="columns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
      deletable
      editable
      selectable
      :dropdown-items="getDropdownItems"
      @delete="clickDelete"
      @edit="clickEdit"
    />
  </UCard>
</template>

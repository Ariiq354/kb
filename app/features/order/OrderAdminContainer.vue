<script setup lang="ts">
import type { OrderRow } from "./constants";
import type { PageSearch } from "~/utils/types";
import { computed, ref } from "vue";
import DataTable from "~/components/Custom/DataTable.vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import { openModal } from "~/composables/modal";
import { getColumns } from "./constants";

const query = ref<PageSearch>({ page: 1 });
const { data, status, refresh } = await useFetch<any>("/api/v1/order", {
  query,
});

function confirmVerify(row: OrderRow) {
  openModal(ModalConfirm, {
    title: "Konfirmasi Verifikasi Pembayaran",
    description: `Apakah Anda yakin ingin memverifikasi pembayaran untuk pesanan #ORD-${row.id} (${row.produkJudul}) atas nama ${row.userName} menjadi LUNAS?`,
    path: `/api/v1/order/${row.id}`,
    method: "PATCH",
    body: { status: "PAID" },
    confirmText: "Verifikasi Lunas",
    confirmColor: "primary",
    refresh,
  });
}

const columns = computed(() => getColumns(confirmVerify));
</script>

<template>
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch
        :model-value="query.search"
        @update:model-value="query.search = $event; query.page = 1"
      />
    </div>

    <DataTable
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="columns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
    />
  </UCard>
</template>

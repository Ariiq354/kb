<script setup lang="ts">
import type { OrderRow } from "./constants";
import { computed } from "vue";
import DataTable from "~/components/Custom/DataTable.vue";
import ModalOrderBayar from "~/components/Modal/ModalOrderBayar.vue";
import ModalPendingOrder from "~/components/Modal/ModalPendingOrder.vue";
import { openModal } from "~/composables/modal";
import { getUserColumns } from "./constants";

const { data, status } = await useFetch<any>("/api/v1/order/my");

function onBayar(row: OrderRow) {
  openModal(ModalOrderBayar, {
    orderId: row.id,
    produkJudul: row.produkJudul,
    finalHarga: row.finalHarga,
  });
}

function onLihat(row: OrderRow) {
  openModal(ModalPendingOrder, {
    produk: {
      id: row.produkId,
      type: row.produkType,
      judul: row.produkJudul,
    },
    order: {
      id: row.id,
      status: row.status,
      finalHarga: row.finalHarga,
    },
  });
}

const columns = computed(() => getUserColumns(onBayar, onLihat));
</script>

<template>
  <UCard>
    <DataTable
      :data="data?.data ?? []"
      :columns="columns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
    />
  </UCard>
</template>

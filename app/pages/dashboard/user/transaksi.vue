<script setup lang="ts">
import OrderUserContainer from "~/features/order/OrderUserContainer.vue";

useHead({
  title: "Transaksi Saya",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Transaksi Saya">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <OrderUserContainer />
    </template>
  </UDashboardPanel>
</template>

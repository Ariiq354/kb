<script setup lang="ts">
import OrderAdminContainer from "~/features/order/OrderAdminContainer.vue";

useHead({
  title: "Kelola Order",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Kelola Order">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <OrderAdminContainer />
    </template>
  </UDashboardPanel>
</template>

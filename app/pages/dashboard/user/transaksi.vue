<script setup lang="ts">
useHead({
  title: "Transaksi",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Transaksi">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div>
        Ini Transaksi
      </div>
    </template>
  </UDashboardPanel>
</template>

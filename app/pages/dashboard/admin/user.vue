<script setup lang="ts">
useHead({
  title: "Kelola User",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Kelola User">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div>
        Ini Kelola User
      </div>
    </template>
  </UDashboardPanel>
</template>

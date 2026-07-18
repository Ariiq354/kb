<script setup lang="ts">
import CariPasanganContainer from "~/features/cari-pasangan/CariPasanganContainer.vue";

useHead({
  title: "Cari Pasangan",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Cari Pasangan">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <CariPasanganContainer />
    </template>
  </UDashboardPanel>
</template>

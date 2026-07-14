<script setup lang="ts">
import UserContainer from "~/features/user/UserContainer.vue";

useHead({
  title: "Kelola Anggota",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Kelola Anggota">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UserContainer />
    </template>
  </UDashboardPanel>
</template>

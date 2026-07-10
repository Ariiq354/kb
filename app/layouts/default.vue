<script setup lang="ts">
import DashboardSidebar from "~/components/App/DashboardSidebar.vue";
</script>

<template>
  <UDashboardGroup unit="rem">
    <DashboardSidebar />
    <slot />
  </UDashboardGroup>
</template>

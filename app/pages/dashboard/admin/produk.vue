<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const links = [
  {
    label: "Bootcamp",
    icon: "i-lucide-graduation-cap",
    to: "/dashboard/admin/produk/bootcamp",
  },
  {
    label: "E-Book",
    icon: "i-lucide-book-open",
    to: "/dashboard/admin/produk/ebook",
  },
  {
    label: "Course",
    icon: "i-lucide-monitor-play",
    to: "/dashboard/admin/produk/course",
  },
] satisfies NavigationMenuItem[];
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Produk">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>

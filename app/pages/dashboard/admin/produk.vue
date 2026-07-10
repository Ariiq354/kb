<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const links = [{
  label: "Produk",
  icon: "i-lucide-settings",
  to: "/dashboard/admin/produk",
  exact: true,
}, {
  label: "Bootcamp",
  icon: "i-lucide-users",
  to: "/dashboard/admin/produk/bootcamp",
}, {
  label: "E-Book",
  icon: "i-lucide-bell",
  to: "/dashboard/admin/produk/ebook",
}, {
  label: "Course",
  icon: "i-lucide-shield",
  to: "/dashboard/admin/produk/course",
}] satisfies NavigationMenuItem[];
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

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { computed } from "vue";
import { useRoute } from "#imports";

const route = useRoute();
const isDetailPage = computed(() => !!route.params.id);

const backToPath = computed(() => {
  if (route.path.includes("/ebook/"))
    return "/dashboard/user/produk/ebook";
  if (route.path.includes("/course/"))
    return "/dashboard/user/produk/course";
  return "/dashboard/user/produk/bootcamp";
});

const links = [
  {
    label: "Bootcamp",
    icon: "i-lucide-graduation-cap",
    to: "/dashboard/user/produk/bootcamp",
  },
  {
    label: "E-Book",
    icon: "i-lucide-book-open",
    to: "/dashboard/user/produk/ebook",
  },
  {
    label: "Course",
    icon: "i-lucide-monitor-play",
    to: "/dashboard/user/produk/course",
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
      <UDashboardNavbar :title="isDetailPage ? 'Detail Produk' : 'Produk'">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton
            v-if="isDetailPage"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            :to="backToPath"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar v-if="!isDetailPage">
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { useAuthSession } from "~/composables/auth";
import { openModal } from "~/composables/modal.js";
import { useToastError } from "~/composables/toast.js";
import { authClient } from "~/utils/auth";
import ModalPassword from "../Modal/ModalPassword.vue";

const config = useRuntimeConfig();
const { session } = await useAuthSession();

async function signOut() {
  try {
    await authClient.signOut();
    await navigateTo("/login", { external: true });
  }
  catch {
    useToastError("Error", "Gagal keluar. Silahkan coba lagi.");
  }
}

const open = ref(false);

function closeSidebar() {
  open.value = false;
}

const { data: me } = await useFetch("/api/v1/users/me");

const links = computed<NavigationMenuItem[][]>(() => {
  const isAdmin = session.value?.user.role === "admin";
  const menu: NavigationMenuItem[][] = [];

  if (isAdmin) {
    menu.push([
      {
        label: "Admin",
        type: "label" as const,
      },
      {
        label: "Kelola Ta'aruf",
        icon: "i-lucide-heart",
        to: "/dashboard/admin/taaruf",
        onSelect: closeSidebar,
      },
      {
        label: "Kelola Produk",
        icon: "i-lucide-shopping-bag",
        type: "trigger",
        children: [
          {
            label: "Bootcamp",
            to: "/dashboard/admin/produk/bootcamp",
            onSelect: closeSidebar,
          },
          {
            label: "E-Book",
            to: "/dashboard/admin/produk/ebook",
            onSelect: closeSidebar,
          },
          {
            label: "Course",
            to: "/dashboard/admin/produk/course",
            onSelect: closeSidebar,
          },
        ],
      },
      {
        label: "Kelola Diskon",
        icon: "i-lucide-ticket-percent",
        to: "/dashboard/admin/diskon",
        onSelect: closeSidebar,
      },
      {
        label: "Kelola Order",
        icon: "i-lucide-shopping-cart",
        to: "/dashboard/admin/order",
        onSelect: closeSidebar,
      },
      {
        label: "Kelola User",
        icon: "i-lucide-users",
        to: "/dashboard/admin/user",
        onSelect: closeSidebar,
      },
    ]);
  }

  const userMenu: NavigationMenuItem[] = [
    {
      label: "User",
      type: "label" as const,
    },
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/dashboard",
      onSelect: closeSidebar,
    },
    {
      label: "Profil",
      icon: "i-lucide-user",
      to: "/dashboard/user/profile",
      onSelect: closeSidebar,
    },
  ];

  // Only show "Cari Pasangan" if the user has completed their profile (has a kodeUser)
  if (me.value?.kodeUser) {
    userMenu.push({
      label: "Cari Pasangan",
      icon: "i-lucide-sparkles",
      to: "/dashboard/user/cari-pasangan",
      onSelect: closeSidebar,
    });
  }

  userMenu.push(
    {
      label: "Ta'aruf",
      icon: "i-lucide-heart",
      to: "/dashboard/user/taaruf",
      onSelect: closeSidebar,
    },
    {
      label: "Produk",
      icon: "i-lucide-shopping-bag",
      to: "/dashboard/user/produk",
      onSelect: closeSidebar,
    },
    {
      label: "Transaksi",
      icon: "i-lucide-wallet",
      to: "/dashboard/user/transaksi",
      onSelect: closeSidebar,
    },
  );

  menu.push(userMenu);

  return menu;
});

const dropdownItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: "label",
      label: session.value?.user.name ?? "User",
      avatar: {
        src: session.value?.user.image ? (session.value.user.image.startsWith("http") ? session.value.user.image : `${config.public.imageUrl}/${session.value.user.image}`) : undefined,
        alt: session.value?.user.name ?? "User",
      },
    },
  ],
  [
    {
      label: "Ubah Password",
      icon: "i-lucide-key-round",
      onSelect: () => openModal(ModalPassword),
    },
  ],
  [
    {
      label: "Keluar",
      icon: "i-lucide-log-out",
      onSelect: signOut,
    },
  ],
]);
</script>

<template>
  <UDashboardSidebar
    id="default"
    v-model:open="open"
    collapsible
    resizable
    class="bg-white dark:bg-gray-900 transition-all duration-300 min-w-0 border-r border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <template #header>
      <div class="hidden w-full md:flex items-center justify-center gap-3 px-2 py-3">
        <NuxtImg
          src="/logo.webp"
          alt="Keluarga Bahagia"
          class="h-10 w-10"
        />
        <div class="font-bold text-primary-500 text-nowrap">
          Keluarga Bahagia
        </div>
      </div>
    </template>

    <template #default>
      <UNavigationMenu
        :items="links"
        orientation="vertical"
        :ui="{
          label: 'text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-2',
          link: [
            'rounded-lg px-3 py-2 text-sm transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
            'data-[active=true]:bg-primary-50 dark:data-[active=true]:bg-primary-900/20 data-[active=true]:text-primary-600 dark:data-[active=true]:text-primary-400',
          ],
          item: 'my-0.5',
          separator: 'h-px bg-gray-200 dark:bg-gray-800 my-2',
        }"
      />
    </template>

    <template #footer>
      <UDropdownMenu
        :items="dropdownItems"
        :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
      >
        <UButton
          :avatar="{
            src: session?.user.image ? (session.user.image.startsWith('http') ? session.user.image : `${config.public.imageUrl}/${session.user.image}`) : undefined,
            alt: session?.user.name ?? 'User',
            loading: 'lazy',
          }"
          :label="session?.user.name ?? 'User'"
          color="neutral"
          variant="ghost"
          block
          class="data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800"
          trailing-icon="i-lucide-chevrons-up-down"
          :ui="{
            trailingIcon: 'text-gray-500 dark:text-gray-400',
          }"
        />
      </UDropdownMenu>
    </template>
  </UDashboardSidebar>
</template>

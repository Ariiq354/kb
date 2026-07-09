<script setup lang="ts">
import { ref } from "vue";

const isMenuOpen = ref(false);

const navLinks = [
  {
    label: "Beranda",
    to: "/",
  },
  {
    label: "Tentang Kami",
    to: "/about",
  },
  {
    label: "Layanan",
    to: "/products",
  },
  {
    label: "Kontak",
    to: "/contact",
  },
];

function closeMenu() {
  isMenuOpen.value = false;
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <div class="sticky top-0 z-100 bg-just-right/10 py-3 shadow-xs backdrop-blur-xl supports-backdrop-filter:bg-just-right/10 md:py-4.5">
    <div class="container flex items-center justify-between gap-4">
      <ULink to="/" class="flex min-w-0 items-center gap-2" @click="closeMenu">
        <NuxtImg src="/logo.webp" alt="logo" class="h-10 shrink-0 md:h-12" />
        <h1 class="truncate text-lg font-bold uppercase tracking-wide text-primary sm:text-xl md:text-2xl">
          Keluarga Bahagia
        </h1>
      </ULink>

      <nav class="nav hidden lg:flex">
        <ULink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          active-class="active"
        >
          {{ link.label }}
        </ULink>
      </nav>

      <UButton to="/login" class="hidden rounded-full px-6 py-2 text-sm lg:inline-flex">
        Daftar Sekarang
      </UButton>

      <UButton
        color="primary"
        variant="ghost"
        :icon="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
        class="lg:hidden"
        :aria-label="isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'"
        :aria-expanded="isMenuOpen"
        aria-controls="landing-mobile-menu"
        @click="toggleMenu"
      />
    </div>

    <div
      v-if="isMenuOpen"
      id="landing-mobile-menu"
      class="container lg:hidden"
    >
      <nav class="mt-4 flex flex-col gap-2 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-primary/10 backdrop-blur">
        <ULink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          active-class="active-mobile"
          class="rounded-xl px-4 py-3 font-semibold text-eastern-blue-700 transition hover:bg-primary/10"
          @click="closeMenu"
        >
          {{ link.label }}
        </ULink>

        <UButton to="/login" class="mt-2 justify-center rounded-full px-6 py-2 text-sm" @click="closeMenu">
          Daftar Sekarang
        </UButton>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.nav {
  align-items: center;
  gap: 1.5rem;
}

.nav a {
  position: relative;
  padding-bottom: 4px;
  font-weight: 600;
  color: var(--color-eastern-blue-700);
  text-decoration: none;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
}

/* underline */
.nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 2px;
  background-color: var(--color-eastern-blue-700);
  transition: width 0.3s ease;
}

/* hover effect */
.nav a:hover {
  transform: translateY(-2px);
  opacity: 0.8;
}

.nav a:hover::after {
  width: 100%;
}

/* active/current page */
.nav a.active {
  font-weight: 700;
}

.nav a.active::after {
  width: 100%;
}

.active-mobile {
  background-color: color-mix(in oklab, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}
</style>

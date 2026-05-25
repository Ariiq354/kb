<template>
  <div class="bg-just-right/10 py-4.5 shadow-xs sticky top-0 z-100 backdrop-blur-xl supports-backdrop-filter:bg-just-right/10">
    <div class="container flex justify-between">
      <div class="flex gap-2 items-center">
        <NuxtImg src="/logo.webp" alt="logo" class="h-12" />
        <h1 class="text-mosque uppercase tracking-wide font-bold text-2xl">
          Keluarga Bahagia
        </h1>
      </div>
      <nav class="nav">
        <ULink to="/" active-class="active">
          Beranda
        </ULink>

        <ULink to="/about" active-class="active">
          Tentang Kami
        </ULink>

        <ULink to="/products" active-class="active">
          Layanan
        </ULink>

        <ULink to="/contact" active-class="active">
          Kontak
        </ULink>
      </nav>
      <UButton to="/login" class="rounded-full px-6 py-2 text-sm">
        Daftar Sekarang
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav a {
  position: relative;
  padding-bottom: 4px;
  font-weight: 600;
  color: var(--color-mosque);
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
  background-color: var(--color-mosque);
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
</style>

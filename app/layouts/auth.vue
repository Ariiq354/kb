<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <NuxtImg
      src="/images/bg-auth.webp"
      alt="Background"
      class="absolute inset-0 h-full w-full scale-110 object-cover blur-sm opacity-50"
    />

    <div
      class="absolute inset-0 bg-linear-to-br from-white/10 via-pink-100/20 to-rose-200/25"
    />

    <div class="relative z-10 w-full max-w-md p-4">
      <slot />
    </div>
  </div>
</template>

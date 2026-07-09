<template>
  <footer class="rounded-t-2xl bg-just-right/20">
    <div class="container grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_auto] lg:items-start lg:py-6">
      <div class="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
        <div class="flex min-w-0 items-center gap-2">
          <NuxtImg src="/logo.webp" alt="logo" class="h-10 shrink-0 md:h-12" />
          <h1 class="truncate text-lg font-bold uppercase tracking-wide text-primary sm:text-xl md:text-2xl">
            Keluarga Bahagia
          </h1>
        </div>
        <p class="max-w-sm text-sm leading-relaxed text-muted">
          Mendampingi keluarga Indonesia menuju kehidupan yang lebih bahagia dan harmonis.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <h1 class="footer-title">
          Hubungi Kami
        </h1>
        <ul class="flex flex-col gap-2">
          <li class="flex min-w-0 items-start gap-2 text-sm sm:text-base">
            <UIcon name="i-lucide-mail" class="mt-0.5 size-5 shrink-0" />
            <span class="break-all">
              halokeluargabahagia@gmail.com
            </span>
          </li>
          <li class="flex items-start gap-2 text-sm sm:text-base">
            <UIcon name="i-lucide-phone" class="mt-0.5 size-5 shrink-0" />
            <span>
              +62 857 7204 8120
            </span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-4 sm:items-start lg:items-end">
        <h1
          class="footer-title"
        >
          Follow Us
        </h1>
        <ul class="flex flex-wrap gap-3 sm:gap-4">
          <li>
            <NuxtLink
              href="https://www.instagram.com/keluargabahagia.id_?igsh=MWkzazAyazM0MmVyag=="
              target="_blank"
              class="flex size-11 items-center justify-center rounded-full bg-just-right/50 transition hover:bg-primary/15"
              aria-label="Instagram Keluarga Bahagia"
            >
              <UIcon name="i-mdi-instagram" class="size-5" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              href="https://www.tiktok.com/@keluargabahagia_id?_t=8njgSqMVs5H&_r=1"
              target="_blank"
              class="flex size-11 items-center justify-center rounded-full bg-just-right/50 transition hover:bg-primary/15"
              aria-label="TikTok Keluarga Bahagia"
            >
              <UIcon name="i-ic-baseline-tiktok" class="size-5" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              href="https://www.youtube.com/@KeluargaBahagia_id"
              target="_blank"
              class="flex size-11 items-center justify-center rounded-full bg-just-right/50 transition hover:bg-primary/15"
              aria-label="YouTube Keluarga Bahagia"
            >
              <UIcon name="i-mdi-youtube" class="size-5" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-title {
  position: relative;
  width: fit-content;
  font-size: 1.125rem;
  font-weight: 600;
  padding-bottom: 6px;
}

.footer-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 70%; /* border length */
  height: 2px;
  background-color: var(--color-primary);
}
</style>

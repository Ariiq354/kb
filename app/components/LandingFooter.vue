<template>
  <footer class="bg-just-right/20 flex justify-between rounded-t-2xl ">
    <div class="container flex justify-between items-center py-6">
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <NuxtImg src="/logo.webp" alt="logo" class="h-12" />
          <h1 class="text-mosque uppercase tracking-wide font-bold text-2xl">
            Keluarga Bahagia
          </h1>
        </div>
        <p class="text-sm max-w-xs text-muted leading-relaxed">
          Mendampingi keluarga Indonesia menuju kehidupan yang lebih bahagia dan harmonis.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <h1 class="footer-title">
          Hubungi Kami
        </h1>
        <ul class="flex flex-col gap-2">
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-mail" size="{20}" />
            halokeluargabahagia@gmail.com
          </li>
          <li class="flex w-44 items-center gap-2">
            <UIcon name="i-lucide-phone" size="{20}" /> +62 857 7204 8120
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-4">
        <h1
          class="footer-title"
        >
          Follow Us
        </h1>
        <ul class="flex gap-6">
          <li>
            <NuxtLink
              href="https://www.instagram.com/keluargabahagia.id_?igsh=MWkzazAyazM0MmVyag=="
              target="_blank"
              class="p-3 rounded-full bg-just-right/50 flex items-center justify-center"
            >
              <UIcon name="i-mdi-instagram" size="20" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              href="https://www.tiktok.com/@keluargabahagia_id?_t=8njgSqMVs5H&_r=1"
              target="_blank"
              class="p-3 rounded-full bg-just-right/50 flex items-center justify-center"
            >
              <UIcon name="i-ic-baseline-tiktok" size="20" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              href="https://www.youtube.com/@KeluargaBahagia_id"
              target="_blank"
              class="p-3 rounded-full bg-just-right/50 flex items-center justify-center"
            >
              <UIcon name="i-mdi-youtube" size="20" />
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
  background-color: var(--color-mosque);
}
</style>

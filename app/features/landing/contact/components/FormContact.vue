<template>
  <UCard
    class="container -mt-8 max-w-250 bg-eastern-blue-100 shadow-xl md:-mt-12"
    :ui="{ body: 'p-4 md:py-12' }"
  >
    <div class="mx-auto space-y-6">
      <div class="space-y-3 text-center">
        <h2 class="text-4xl font-semibold text-highlighted">
          Email
        </h2>
        <p class="text-lg text-toned">
          Anda bisa menghubungi kami melalui layanan email melalui kolom dibawah ini.
        </p>
      </div>

      <form id="email-form" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UInput
            name="name"
            placeholder="Nama"
            autocomplete="name"
            size="lg"
            class="w-full"
          />
          <UInput
            name="email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            size="lg"
            class="w-full"
          />
        </div>

        <UTextarea
          name="message"
          placeholder="Pesan"
          :rows="10"
          size="lg"
          class="w-full"
        />

        <div class="flex w-full justify-end">
          <UButton
            type="submit"
            form="email-form"
            label="Kirim"
            size="lg"
          />
        </div>
      </form>
    </div>
  </UCard>
</template>

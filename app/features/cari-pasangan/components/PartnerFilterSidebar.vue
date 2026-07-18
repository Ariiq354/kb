<script setup lang="ts">
defineEmits<{
  reset: [];
}>();

const filters = defineModel<{
  search: string;
  suku: string;
  umurRange: [number, number];
  pendidikan: string | undefined;
  statusKawin: string | undefined;
  agama: string | undefined;
  perokok: string | undefined;
}>({ required: true });
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-6">
    <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
      <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-md">
        <UIcon name="i-lucide-filter" class="size-5 text-primary shrink-0" />
        Filter Pencarian
      </h3>
      <UButton
        variant="ghost"
        size="xs"
        color="neutral"
        class="text-gray-500 hover:text-primary"
        @click="$emit('reset')"
      >
        Reset Filter
      </UButton>
    </div>

    <div class="space-y-5">
      <!-- Search Input -->
      <UFormField label="Kata Kunci" name="search">
        <UInput
          v-model="filters.search"
          placeholder="Cari nama, pekerjaan, deskripsi..."
          icon="i-lucide-search"
          class="w-full"
        />
      </UFormField>

      <!-- Suku Input -->
      <UFormField label="Suku / Etnis" name="suku">
        <UInput
          v-model="filters.suku"
          placeholder="Contoh: Jawa, Sunda, Minang..."
          icon="i-lucide-users"
          class="w-full"
        />
      </UFormField>

      <!-- Age Range USlider -->
      <UFormField label="Rentang Umur (Tahun)" name="rangeUmur">
        <div class="space-y-2.5 pt-1">
          <div class="flex justify-between text-xs text-gray-500 font-semibold dark:text-gray-400">
            <span class="bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-sm border border-gray-100 dark:border-gray-700">
              {{ filters.umurRange[0] }} Tahun
            </span>
            <span class="bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-sm border border-gray-100 dark:border-gray-700">
              {{ filters.umurRange[1] }} Tahun
            </span>
          </div>
          <USlider
            v-model="filters.umurRange"
            :min="18"
            :max="60"
            :step="1"
            class="py-2"
          />
        </div>
      </UFormField>

      <!-- Pendidikan -->
      <UFormField label="Pendidikan Terakhir" name="pendidikan">
        <USelect
          v-model="filters.pendidikan"
          :items="['SMA', 'D3', 'S1', 'S2', 'S3']"
          placeholder="Pilih Pendidikan"
          class="w-full"
        />
      </UFormField>

      <!-- Status Pernikahan -->
      <UFormField label="Status Pernikahan" name="statusKawin">
        <USelect
          v-model="filters.statusKawin"
          :items="['Belum Menikah', 'Cerai']"
          placeholder="Pilih Status"
          class="w-full"
        />
      </UFormField>

      <!-- Agama -->
      <UFormField label="Agama" name="agama">
        <USelect
          v-model="filters.agama"
          :items="['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu']"
          placeholder="Pilih Agama"
          class="w-full"
        />
      </UFormField>

      <!-- Kebiasaan Merokok -->
      <UFormField label="Kebiasaan Merokok" name="perokok">
        <USelect
          v-model="filters.perokok"
          :items="[
            { label: 'Semua', value: 'semua' },
            { label: 'Tidak Merokok', value: 'tidak' },
            { label: 'Perokok', value: 'ya' },
          ]"
          placeholder="Pilih Status Merokok"
          class="w-full"
        />
      </UFormField>
    </div>
  </div>
</template>

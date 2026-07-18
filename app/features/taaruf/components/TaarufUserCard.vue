<script setup lang="ts">
import type { TaarufProcess } from "../types";
import { ref } from "vue";
import MemberDetailModal from "~/features/cari-pasangan/components/MemberDetailModal.vue";
import { getStatusColor, getStatusLabel } from "../utils";

defineProps<{
  proses: TaarufProcess;
}>();

defineEmits<{
  riwayat: [prosesId: number];
  batal: [prosesId: number, partnerName: string];
}>();

const config = useRuntimeConfig();

const isDetailOpen = ref(false);
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs p-5 flex flex-col justify-between space-y-5 hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900 transition-all duration-300">
    <!-- Card Header (Target Partner info) -->
    <div class="flex items-center gap-4">
      <div class="relative size-14 shrink-0 rounded-xl overflow-hidden shadow-xs border border-gray-100 dark:border-gray-800">
        <NuxtImg
          :src="proses.otherUser.image ? (proses.otherUser.image.startsWith('http') ? proses.otherUser.image : `${config.public.imageUrl}/${proses.otherUser.image}`) : undefined"
          class="h-full w-full object-cover object-center"
          alt="Foto Calon"
        />
      </div>
      <div class="space-y-0.5 min-w-0">
        <h4 class="font-bold text-gray-900 dark:text-white text-md truncate">
          {{ proses.otherUser.name }}
        </h4>
        <p class="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <span class="font-bold text-primary">{{ proses.otherUser.kodeUser }}</span>
          <span>•</span>
          <span>{{ proses.otherUser.kotaNama || '-' }}</span>
        </p>
      </div>
    </div>

    <!-- Status badge -->
    <div class="space-y-1">
      <span class="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Status Progress</span>
      <UBadge :color="getStatusColor(proses.status)" variant="subtle" size="md">
        {{ getStatusLabel(proses.status) }}
      </UBadge>
    </div>

    <!-- Action buttons -->
    <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
      <UButton
        variant="subtle"
        color="primary"
        class="flex-1 justify-center"
        size="xs"
        icon="i-lucide-user"
        @click="() => { isDetailOpen = true; }"
      >
        Profil
      </UButton>
      <UButton
        variant="subtle"
        color="neutral"
        class="flex-1 justify-center"
        size="xs"
        icon="i-lucide-history"
        @click="$emit('riwayat', proses.id)"
      >
        Riwayat
      </UButton>
      <UButton
        v-if="!['REJECTED', 'CANCELLED', 'MARRIED'].includes(proses.status)"
        variant="subtle"
        color="error"
        size="xs"
        icon="i-lucide-x-circle"
        @click="$emit('batal', proses.id, proses.otherUser.name || 'Calon')"
      >
        Batalkan
      </UButton>
    </div>

    <!-- Member Detail Modal -->
    <MemberDetailModal
      v-model="isDetailOpen"
      :member-id="proses.otherUser.id"
    />
  </div>
</template>

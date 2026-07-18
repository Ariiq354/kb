<script setup lang="ts">
import type { MemberDetail } from "./MemberDetailModal.vue";

defineProps<{
  member: MemberDetail;
}>();

defineEmits<{
  view: [member: MemberDetail];
}>();

const config = useRuntimeConfig();

function calculateAge(birthDateString?: string | null) {
  if (!birthDateString)
    return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col group hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900 transition-all duration-300">
    <!-- Avatar Area -->
    <div class="relative aspect-video w-full bg-gray-50 dark:bg-gray-800 overflow-hidden border-b border-gray-50 dark:border-gray-800">
      <NuxtImg
        :src="member.image ? (member.image.startsWith('http') ? member.image : `${config.public.imageUrl}/${member.image}`) : undefined"
        class="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
        alt="Foto Calon"
      />
      <div class="absolute top-3 right-3 flex gap-1.5">
        <span class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-primary-700 dark:text-primary-300 shadow-xs border border-white/20">
          {{ member.kodeUser }}
        </span>
      </div>
    </div>

    <!-- Info Area -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div class="space-y-2">
        <h4 class="font-bold text-gray-900 dark:text-white text-lg truncate">
          {{ member.name }}
        </h4>
        <div class="flex flex-wrap gap-1.5">
          <UBadge variant="subtle" size="sm" color="primary">
            {{ calculateAge(member.tanggalLahir) }} Thn
          </UBadge>
          <UBadge variant="subtle" size="sm" color="neutral">
            Suku {{ member.suku }}
          </UBadge>
          <UBadge variant="subtle" size="sm" color="neutral">
            {{ member.pendidikan }}
          </UBadge>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed pt-1">
          "{{ member.deskripsi }}"
        </p>
      </div>

      <!-- Footer Action -->
      <div class="pt-3.5 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 mt-2">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <UIcon name="i-lucide-map-pin" class="size-3.5 text-gray-400 shrink-0" />
          {{ member.kotaNama || '-' }}
        </span>
        <UButton size="xs" variant="solid" color="primary" @click="$emit('view', member)">
          Detail Profil
        </UButton>
      </div>
    </div>
  </div>
</template>

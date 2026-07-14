<script setup lang="ts">
import type { Lesson } from "../types";
import { ref } from "vue";
import { useToastError } from "~/composables/toast";

import { formatBytes } from "~/utils/number";

defineProps<{
  selectedLesson: Lesson | null;
  isLoading: boolean;
  imageUrlConfig: string;
  activeMode: "create-lesson" | "edit-lesson";
}>();

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "cancel"): void;
  (e: "delete", id: number): void;
}>();

const model = defineModel<{
  judul: string;
  videoFile: File | null;
  duration: number;
  order: number;
}>({ required: true });

const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
  fileInputRef.value?.click();
}

function onDropVideo(event: DragEvent) {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0];
    if (file.type.startsWith("video/")) {
      model.value.videoFile = file;
    }
    else {
      useToastError("Gagal", "File harus berupa format video!");
    }
  }
}

function handleVideoFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    model.value.videoFile = target.files[0];
  }
}

function clearVideoFile() {
  model.value.videoFile = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {{ activeMode === 'create-lesson' ? 'Tambah Lesson Baru' : 'Edit Detail Lesson' }}
      </h3>
      <p class="text-xs text-neutral-500">
        {{ activeMode === 'create-lesson' ? 'Menambahkan materi video pembelajaran baru ke dalam section' : 'Mengubah detail lesson atau mengganti file video pembelajaran' }}
      </p>
    </div>

    <div class="space-y-4">
      <UFormField label="Judul Lesson" name="lesson-judul" required>
        <UInput
          v-model="model.judul"
          placeholder="Contoh: Instalasi Tools & Setup Project..."
          class="w-full"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField :label="activeMode === 'create-lesson' ? 'Video File (Video MP4/WebM)' : 'Ganti Video File (Opsional)'" name="lesson-file" :required="activeMode === 'create-lesson'">
        <!-- Drag-and-drop file upload zone -->
        <div
          class="border border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer text-center"
          :class="[
            isDragging ? 'border-primary-500 bg-primary-500/5' : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50',
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDropVideo"
          @click="triggerFileInput"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            class="hidden"
            @change="handleVideoFileChange"
          >
          <div v-if="!model.videoFile" class="space-y-2">
            <div class="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500 dark:text-neutral-400">
              <UIcon name="i-lucide-upload-cloud" class="text-xl" />
            </div>
            <template v-if="activeMode === 'create-lesson'">
              <p class="text-xs font-semibold text-neutral-750 dark:text-neutral-300">
                Klik atau seret file video di sini untuk mengunggah
              </p>
              <p class="text-[10px] text-neutral-500">
                MP4, WebM, OGG atau MOV (Maks. 500MB)
              </p>
            </template>
            <template v-else>
              <p class="text-xs font-semibold text-neutral-750 dark:text-neutral-300">
                Seret video baru di sini untuk mengganti (opsional)
              </p>
              <p class="text-[10px] text-neutral-500">
                Kosongkan jika tidak ingin mengubah video saat ini
              </p>
            </template>
          </div>
          <div v-else class="space-y-2 w-full flex items-center justify-between bg-neutral-100 dark:bg-neutral-800/80 px-4 py-2 rounded-lg">
            <div class="flex items-center gap-2 truncate min-w-0">
              <UIcon name="i-lucide-video" class="text-primary-500 shrink-0 text-sm" />
              <span class="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                {{ model.videoFile.name }}
              </span>
              <span class="text-[10px] text-neutral-500 shrink-0 font-mono">
                ({{ formatBytes(model.videoFile.size) }})
              </span>
            </div>
            <UButton
              size="xs"
              color="error"
              variant="ghost"
              icon="i-lucide-x"
              @click.stop="clearVideoFile"
            />
          </div>
        </div>
        <div v-if="activeMode === 'edit-lesson' && selectedLesson?.videoUrl && !model.videoFile" class="mt-2 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
          <UIcon name="i-lucide-link" class="text-neutral-400" />
          <span>Video saat ini: </span>
          <a
            :href="`${imageUrlConfig}/${selectedLesson.videoUrl}`"
            target="_blank"
            class="text-primary-500 hover:underline font-mono truncate max-w-xs block"
          >
            {{ selectedLesson.videoUrl.split('/').pop() }}
          </a>
        </div>
      </UFormField>

      <!-- Video Preview Card -->
      <div v-if="activeMode === 'edit-lesson' && selectedLesson?.videoUrl && !model.videoFile" class="space-y-1.5">
        <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
          <UIcon name="i-lucide-eye" class="text-primary-500 text-sm" />
          Preview Video Saat Ini
        </span>
        <div class="rounded-xl overflow-hidden shadow-md border border-neutral-200 dark:border-neutral-800 bg-black aspect-video max-h-56 flex items-center justify-center">
          <video
            :src="`${imageUrlConfig}/${selectedLesson.videoUrl}`"
            controls
            class="w-full h-full object-contain"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Durasi (Detik)" name="lesson-duration" required>
          <UInputNumber
            v-model="model.duration"
            :min="0"
            class="w-full"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Urutan" name="lesson-order" required>
          <UInputNumber
            v-model="model.order"
            :min="0"
            class="w-full"
            :disabled="isLoading"
          />
        </UFormField>
      </div>
    </div>

    <div class="flex items-center pt-6 border-t border-neutral-200 dark:border-neutral-800" :class="[activeMode === 'edit-lesson' ? 'justify-between' : 'justify-end gap-2']">
      <UButton
        v-if="activeMode === 'edit-lesson' && selectedLesson"
        color="error"
        variant="subtle"
        icon="i-lucide-trash-2"
        :disabled="isLoading"
        @click="emit('delete', selectedLesson.id)"
      >
        Hapus Lesson
      </UButton>
      <div class="flex items-center gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          :disabled="isLoading"
          @click="emit('cancel')"
        >
          Batal
        </UButton>
        <UButton
          :loading="isLoading"
          icon="i-lucide-check"
          color="primary"
          @click="emit('submit')"
        >
          {{ activeMode === 'edit-lesson' ? 'Simpan Perubahan' : 'Tambah Lesson' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

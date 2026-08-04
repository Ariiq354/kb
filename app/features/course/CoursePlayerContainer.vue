<script setup lang="ts">
import type { Section } from "./types";
import { computed, ref } from "vue";
import { navigateTo, useFetch, useRoute, useRuntimeConfig } from "#imports";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { formatDuration } from "~/utils/number";

interface LessonWithProgress {
  id: number;
  sectionId: number | null;
  judul: string;
  videoUrl: string;
  duration: number | null;
  order: number;
  completedAt: string | null;
}

interface SectionWithProgress extends Section {
  lessons: LessonWithProgress[];
}

const route = useRoute();
const config = useRuntimeConfig();

const courseId = Number(route.params.id);

const { data: playerData, status, refresh } = await useFetch<any>(() => `/api/v1/course/${courseId}/player`);

const selectedLessonId = ref<number | null>(null);

const curriculum = computed<SectionWithProgress[]>(() => playerData.value?.curriculum ?? []);
const courseInfo = computed(() => playerData.value?.course);
const totalLessons = computed(() => playerData.value?.totalLessons ?? 0);
const completedLessons = computed(() => playerData.value?.completedLessons ?? 0);

const progressPercent = computed(() => {
  if (totalLessons.value === 0)
    return 0;
  return Math.round((completedLessons.value / totalLessons.value) * 100);
});

const allLessons = computed(() => {
  const lessons: LessonWithProgress[] = [];
  for (const section of curriculum.value) {
    for (const lesson of section.lessons) {
      lessons.push(lesson);
    }
  }
  return lessons;
});

const selectedLesson = computed(() => {
  if (!selectedLessonId.value)
    return null;
  return allLessons.value.find(l => l.id === selectedLessonId.value) ?? null;
});

const videoUrl = computed(() => {
  if (!selectedLesson.value)
    return "";
  return `${config.public.imageUrl}/${selectedLesson.value.videoUrl}`;
});

function isLessonCompleted(lesson: LessonWithProgress) {
  return lesson.completedAt !== null;
}

function isSectionCompleted(section: SectionWithProgress) {
  return section.lessons.every(l => l.completedAt !== null);
}

function toggleSection(sectionId: number) {
  const el = document.getElementById(`section-${sectionId}`);
  el?.classList.toggle("collapsed");
}

function selectLesson(lessonId: number) {
  selectedLessonId.value = lessonId;
}

function selectFirstIncomplete() {
  for (const section of curriculum.value) {
    for (const lesson of section.lessons) {
      if (!lesson.completedAt) {
        selectedLessonId.value = lesson.id;
        return;
      }
    }
  }
  if (allLessons.value.length > 0) {
    const first = allLessons.value[0];
    if (first)
      selectedLessonId.value = first.id;
  }
}

async function markComplete() {
  if (!selectedLesson.value)
    return;

  try {
    await $fetch(`/api/v1/course/progress/${selectedLesson.value.id}`, {
      method: "POST",
    });

    useToastSuccess("Berhasil", "Lesson ditandai selesai");
    await refresh();

    const currentIndex = allLessons.value.findIndex(l => l.id === selectedLessonId.value);
    if (currentIndex !== -1 && currentIndex < allLessons.value.length - 1) {
      const next = allLessons.value[currentIndex + 1];
      if (next)
        selectedLessonId.value = next.id;
    }
  }
  catch {
    useToastError("Gagal", "Gagal menandai lesson sebagai selesai");
  }
}

function handleBack() {
  navigateTo("/dashboard/user/produk/course");
}

if (status.value !== "pending") {
  selectFirstIncomplete();
}
</script>

<template>
  <div class="space-y-4">
    <!-- Skeleton Loading -->
    <div v-if="status === 'pending'" class="space-y-4">
      <div class="h-4 w-48 rounded bg-muted animate-pulse" />
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-4">
          <USkeleton class="w-full aspect-video rounded-xl" />
          <USkeleton class="h-6 w-64 rounded" />
          <USkeleton class="h-4 w-32 rounded" />
        </div>
        <div class="lg:col-span-1 space-y-3">
          <USkeleton v-for="i in 4" :key="i" class="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>

    <template v-else-if="courseInfo">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-muted">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          size="xs"
          @click="handleBack"
        >
          Kembali
        </UButton>
        <span>/</span>
        <span class="truncate font-medium text-default">{{ courseInfo.judul }}</span>
      </div>

      <!-- Progress Bar -->
      <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">Progres Belajar</span>
          <span class="text-xs text-muted">{{ completedLessons }}/{{ totalLessons }} lesson ({{ progressPercent }}%)</span>
        </div>
        <UProgress :model-value="progressPercent" color="primary" />
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Video Player + Info -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Video Player -->
          <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-black aspect-video shadow-sm">
            <video
              v-if="selectedLesson"
              :key="selectedLesson.id"
              :src="videoUrl"
              controls
              autoplay
              class="w-full h-full object-contain"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
              <div class="text-center space-y-2">
                <UIcon name="i-lucide-play-circle" size="48" class="mx-auto text-gray-600" />
                <p class="text-sm">
                  Pilih lesson untuk mulai belajar
                </p>
              </div>
            </div>
          </div>

          <!-- Lesson Info -->
          <div v-if="selectedLesson" class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-4">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1 min-w-0">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {{ selectedLesson.judul }}
                </h2>
                <div class="flex items-center gap-3 text-xs text-muted">
                  <span v-if="selectedLesson.duration" class="flex items-center gap-1">
                    <UIcon name="i-lucide-clock" />
                    {{ formatDuration(selectedLesson.duration) }}
                  </span>
                  <span v-if="selectedLesson.completedAt" class="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <UIcon name="i-lucide-check-circle" />
                    Selesai
                  </span>
                </div>
              </div>
              <UButton
                v-if="!isLessonCompleted(selectedLesson)"
                color="primary"
                icon="i-lucide-check-circle"
                @click="markComplete"
              >
                Tandai Selesai
              </UButton>
              <UBadge
                v-else
                color="success"
                variant="subtle"
                icon="i-lucide-check-circle"
              >
                Selesai
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Right: Curriculum Sidebar -->
        <div class="lg:col-span-1 space-y-3">
          <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                Kurikulum
              </h3>
            </div>
            <div class="max-h-[60vh] overflow-y-auto">
              <div
                v-for="(section, sIdx) in curriculum"
                :key="section.id"
                class="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <!-- Section Header -->
                <button
                  class="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  @click="toggleSection(section.id)"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <UIcon
                      v-if="isSectionCompleted(section)"
                      name="i-lucide-check-circle-2"
                      class="text-green-500 shrink-0"
                    />
                    <UIcon
                      v-else
                      name="i-lucide-folder"
                      class="text-primary shrink-0"
                    />
                    <span class="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {{ sIdx + 1 }}. {{ section.judul }}
                    </span>
                  </div>
                  <span class="text-[10px] text-muted shrink-0">
                    {{ section.lessons.filter(l => l.completedAt).length }}/{{ section.lessons.length }}
                  </span>
                </button>

                <!-- Lessons List -->
                <div class="bg-gray-50/50 dark:bg-gray-900/50">
                  <button
                    v-for="lesson in section.lessons"
                    :key="lesson.id"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    :class="{
                      'bg-primary-50 dark:bg-primary-950/30 border-l-2 border-l-primary': lesson.id === selectedLessonId,
                      'hover:bg-gray-100 dark:hover:bg-gray-800': lesson.id !== selectedLessonId,
                    }"
                    @click="selectLesson(lesson.id)"
                  >
                    <div class="shrink-0">
                      <UIcon
                        v-if="isLessonCompleted(lesson)"
                        name="i-lucide-check-circle"
                        class="text-green-500 text-sm"
                      />
                      <span
                        v-else
                        class="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-[10px] text-muted"
                      >
                        {{ lesson.order + 1 }}
                      </span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {{ lesson.judul }}
                      </p>
                      <p v-if="lesson.duration" class="text-[10px] text-muted">
                        {{ formatDuration(lesson.duration) }}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Not Found -->
    <div v-else class="py-12 text-center text-muted">
      Course tidak ditemukan.
    </div>
  </div>
</template>

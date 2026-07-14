<script setup lang="ts">
import type { Lesson, Section } from "../types";

import { formatDuration } from "~/utils/number";

defineProps<{
  curriculum: Section[] | null;
  activeMode: "idle" | "create-lesson" | "edit-section" | "edit-lesson";
  selectedSectionId: number | null;
  selectedLessonId: number | null;
}>();

const emit = defineEmits<{
  (e: "selectSection", section: Section): void;
  (e: "selectLesson", lesson: Lesson): void;
  (e: "addSection"): void;
  (e: "addLesson", sectionId: number): void;
}>();

function getSectionDuration(section: Section) {
  if (!section.lessons || section.lessons.length === 0)
    return 0;
  return section.lessons.reduce((total: number, lesson) => total + (lesson.duration || 0), 0);
}
</script>

<template>
  <UCard
    :ui="{
      body: 'p-4 flex-grow flex flex-col max-h-[620px] overflow-y-auto',
      header: 'px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800',
      footer: 'px-4 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50',
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
          <UIcon name="i-lucide-list-tree" class="text-neutral-500" />
          Struktur Kurikulum
        </h2>
        <UBadge color="neutral" variant="outline" size="sm">
          {{ curriculum?.length || 0 }} Modul
        </UBadge>
      </div>
    </template>

    <div class="space-y-4 pr-1">
      <!-- Empty State -->
      <div v-if="!curriculum || curriculum.length === 0" class="text-center py-12 text-neutral-500">
        <div class="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400 dark:text-neutral-600 mb-3">
          <UIcon name="i-lucide-folder-open" class="text-xl" />
        </div>
        <p class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Kurikulum Masih Kosong
        </p>
        <p class="text-[10px] text-neutral-500 mt-1 max-w-45 mx-auto leading-relaxed">
          Belum ada section yang dibuat. Klik tombol di bawah untuk membuat section pertama.
        </p>
      </div>

      <!-- Sections Tree -->
      <div v-else class="space-y-3">
        <div
          v-for="(sect, idx) in curriculum"
          :key="sect.id"
          class="border rounded-xl overflow-hidden bg-neutral-50/30 dark:bg-neutral-900/30 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-850"
          :class="[
            activeMode === 'edit-section' && selectedSectionId === sect.id
              ? 'border-primary-500 dark:border-primary-400 bg-neutral-50 dark:bg-neutral-900/70 shadow-sm ring-1 ring-primary-500/20'
              : 'border-neutral-200 dark:border-neutral-800/80',
          ]"
        >
          <!-- Section Item Header -->
          <div
            class="relative flex items-center justify-between px-3 py-2.5 bg-neutral-100/50 dark:bg-neutral-800/20 border-b border-neutral-200 dark:border-neutral-800 cursor-pointer"
            @click="emit('selectSection', sect)"
          >
            <!-- Active Indicator Border -->
            <div
              v-if="activeMode === 'edit-section' && selectedSectionId === sect.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"
            />

            <div class="flex items-center gap-2 min-w-0">
              <span class="shrink-0 w-5 h-5 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-400 font-mono">
                S{{ Number(idx) + 1 }}
              </span>
              <div class="flex flex-col min-w-0">
                <span class="font-semibold text-xs text-neutral-800 dark:text-neutral-200 truncate">
                  {{ sect.judul }}
                </span>
                <span class="text-[9px] text-neutral-500 flex items-center gap-1 mt-0.5">
                  <span>{{ sect.lessons?.length || 0 }} Lesson</span>
                  <span class="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span>{{ formatDuration(getSectionDuration(sect)) }}</span>
                </span>
              </div>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex items-center gap-0.5">
              <UButton
                size="xs"
                icon="i-lucide-plus"
                variant="ghost"
                color="primary"
                title="Tambah Lesson"
                class="h-6 w-6"
                @click.stop="emit('addLesson', sect.id)"
              />
            </div>
          </div>

          <!-- Lessons List -->
          <div class="p-1.5 space-y-1 relative pl-5.5">
            <!-- Timeline vertical connector -->
            <div
              v-if="sect.lessons && sect.lessons.length > 0"
              class="absolute left-3 top-3 bottom-5 border-l border-dashed border-neutral-200 dark:border-neutral-850"
            />

            <div v-if="!sect.lessons || sect.lessons.length === 0" class="text-center py-2 text-[10px] text-neutral-500 pl-0">
              Belum ada lesson
            </div>

            <div
              v-for="less in sect.lessons"
              :key="less.id"
              class="relative flex items-center justify-between pl-4 pr-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group/lesson"
              :class="[
                activeMode === 'edit-lesson' && selectedLessonId === less.id
                  ? 'bg-primary-50/50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-semibold'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300',
              ]"
              @click="emit('selectLesson', less)"
            >
              <!-- Timeline Bullet (perfectly centered using flex container) -->
              <div class="absolute left-1 top-0 bottom-0 flex items-center justify-center">
                <div
                  class="w-1.5 h-1.5 rounded-full border bg-neutral-50 dark:bg-neutral-900 transition-all duration-200 z-10"
                  :class="[
                    activeMode === 'edit-lesson' && selectedLessonId === less.id
                      ? 'border-primary-500 bg-primary-500 dark:bg-primary-500 scale-125'
                      : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900',
                  ]"
                />
              </div>

              <div class="flex items-center gap-1.5 truncate min-w-0">
                <UIcon
                  name="i-lucide-video"
                  class="w-3.5 h-3.5 shrink-0"
                  :class="[
                    activeMode === 'edit-lesson' && selectedLessonId === less.id
                      ? 'text-primary-500'
                      : 'text-neutral-400 group-hover/lesson:text-neutral-500',
                  ]"
                />
                <span class="text-xs truncate font-normal leading-tight">
                  {{ less.judul }}
                </span>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <span v-if="less.duration" class="text-[9px] text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-800 px-1 py-0.2 rounded">
                  {{ Math.floor(less.duration / 60) }}m {{ less.duration % 60 }}s
                </span>
                <UIcon name="i-lucide-chevron-right" class="text-neutral-400 text-[10px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <UButton
        icon="i-lucide-plus"
        color="primary"
        block
        @click="emit('addSection')"
      >
        Tambah Section Baru
      </UButton>
    </template>
  </UCard>
</template>

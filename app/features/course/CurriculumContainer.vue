<script setup lang="ts">
import type { Lesson, Section } from "./types";
import { FetchError } from "ofetch";
import { computed, ref } from "vue";
import { navigateTo, useFetch, useRuntimeConfig } from "#imports";
import { useToastError, useToastSuccess } from "~/composables/toast";

// Component imports
import CurriculumTree from "~/features/course/components/CurriculumTree.vue";
import LessonForm from "~/features/course/components/LessonForm.vue";
import SectionForm from "~/features/course/components/SectionForm.vue";

import { formatDuration } from "~/utils/number";

const props = defineProps<{
  courseId: number;
}>();

const config = useRuntimeConfig();

const { data: course, status: courseStatus } = await useFetch(() => `/api/v1/course/${props.courseId}`);

const { data: curriculum, refresh: refreshCurriculum, status: curriculumStatus } = await useFetch<Section[]>(() => `/api/v1/course/${props.courseId}/curriculum`);

// UI state
const activeMode = ref<"idle" | "create-lesson" | "edit-section" | "edit-lesson">("idle");
const selectedItem = ref<Section | Lesson | null>(null);
const activeSectionId = ref<number | null>(null);
const isLoading = ref(false);

const selectedSection = computed(() => activeMode.value === "edit-section" ? selectedItem.value as Section : null);
const selectedLesson = computed(() => activeMode.value === "edit-lesson" ? selectedItem.value as Lesson : null);

// Delete confirmation modal states
const isDeleteModalOpen = ref(false);
const deleteTargetType = ref<"section" | "lesson">("section");
const deleteTargetId = ref<number | null>(null);

// Form states
const sectionForm = ref({
  judul: "",
  order: 0,
});

const lessonForm = ref({
  judul: "",
  videoFile: null as File | null,
  duration: 0,
  order: 0,
});

// Computed properties for statistics
const totalLessons = computed(() => {
  if (!curriculum.value)
    return 0;
  return curriculum.value.reduce((acc: number, sect) => acc + (sect.lessons?.length || 0), 0);
});

const totalDurationString = computed(() => {
  if (!curriculum.value)
    return "0 detik";
  const totalSeconds = curriculum.value.reduce((acc: number, sect) => {
    return acc + (sect.lessons?.reduce((lAcc: number, less) => lAcc + (less.duration || 0), 0) || 0);
  }, 0);
  return formatDuration(totalSeconds);
});

// Selection handlers
function selectSection(section: Section) {
  activeMode.value = "edit-section";
  selectedItem.value = section;
  sectionForm.value = {
    judul: section.judul,
    order: section.order,
  };
}

function selectLesson(lesson: Lesson) {
  activeMode.value = "edit-lesson";
  selectedItem.value = lesson;
  lessonForm.value = {
    judul: lesson.judul,
    videoFile: null,
    duration: lesson.duration ?? 0,
    order: lesson.order,
  };
}

function clickAddSection() {
  const nextOrder = curriculum.value && curriculum.value.length > 0
    ? Math.max(...curriculum.value.map(s => s.order)) + 1
    : 0;

  activeMode.value = "edit-section";
  selectedItem.value = null; // null means "creating section"
  sectionForm.value = {
    judul: "Section Baru",
    order: nextOrder,
  };
}

function clickAddLesson(sectionId: number) {
  const section = curriculum.value?.find(s => s.id === sectionId);
  const nextOrder = section && section.lessons && section.lessons.length > 0
    ? Math.max(...section.lessons.map(l => l.order)) + 1
    : 0;

  activeMode.value = "create-lesson";
  activeSectionId.value = sectionId;
  selectedItem.value = null;
  lessonForm.value = {
    judul: "",
    videoFile: null,
    duration: 0,
    order: nextOrder,
  };
}

// Actions
async function saveSection() {
  if (!sectionForm.value.judul.trim()) {
    useToastError("Gagal", "Judul section tidak boleh kosong");
    return;
  }
  isLoading.value = true;
  try {
    if (selectedSection.value) {
      // Edit
      await $fetch(`/api/v1/course/section/${selectedSection.value.id}`, {
        method: "PATCH",
        body: sectionForm.value,
      });
      useToastSuccess("Sukses", "Section berhasil diperbarui");
    }
    else {
      // Create
      await $fetch("/api/v1/course/section", {
        method: "POST",
        body: {
          courseId: props.courseId,
          ...sectionForm.value,
        },
      });
      useToastSuccess("Sukses", "Section berhasil ditambahkan");
    }
    await refreshCurriculum();
    activeMode.value = "idle";
    selectedItem.value = null;
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Gagal menyimpan section", error.data?.message || "Terjadi kesalahan");
    }
    else {
      useToastError("Gagal menyimpan section", "Terjadi kesalahan");
    }
  }
  finally {
    isLoading.value = false;
  }
}

function clickDeleteSection(sectionId: number) {
  deleteTargetType.value = "section";
  deleteTargetId.value = sectionId;
  isDeleteModalOpen.value = true;
}

function clickDeleteLesson(lessonId: number) {
  deleteTargetType.value = "lesson";
  deleteTargetId.value = lessonId;
  isDeleteModalOpen.value = true;
}

async function confirmDelete() {
  if (deleteTargetId.value === null)
    return;
  isLoading.value = true;
  try {
    if (deleteTargetType.value === "section") {
      await $fetch(`/api/v1/course/section/${deleteTargetId.value}`, {
        method: "DELETE",
      });
      useToastSuccess("Sukses", "Section berhasil dihapus");
    }
    else {
      await $fetch(`/api/v1/course/lesson/${deleteTargetId.value}`, {
        method: "DELETE",
      });
      useToastSuccess("Sukses", "Lesson berhasil dihapus");
    }
    await refreshCurriculum();
    activeMode.value = "idle";
    selectedItem.value = null;
    isDeleteModalOpen.value = false;
  }
  catch (error) {
    const target = deleteTargetType.value === "section" ? "section" : "lesson";
    if (error instanceof FetchError) {
      useToastError(`Gagal menghapus ${target}`, error.data?.message || "Terjadi kesalahan");
    }
    else {
      useToastError(`Gagal menghapus ${target}`, "Terjadi kesalahan");
    }
  }
  finally {
    isLoading.value = false;
  }
}

async function saveLesson() {
  if (!lessonForm.value.judul.trim()) {
    useToastError("Gagal", "Judul lesson tidak boleh kosong");
    return;
  }

  isLoading.value = true;
  try {
    const isEdit = activeMode.value === "edit-lesson";
    const url = isEdit ? `/api/v1/course/lesson/${selectedLesson.value!.id}` : "/api/v1/course/lesson";

    const formData = new FormData();
    formData.append("judul", lessonForm.value.judul);
    formData.append("duration", lessonForm.value.duration.toString());
    formData.append("order", lessonForm.value.order.toString());

    if (isEdit) {
      if (lessonForm.value.videoFile) {
        formData.append("videoFile", lessonForm.value.videoFile);
      }
    }
    else {
      formData.append("sectionId", activeSectionId.value!.toString());
      if (!lessonForm.value.videoFile) {
        useToastError("Gagal", "File video wajib diunggah!");
        isLoading.value = false;
        return;
      }
      formData.append("videoFile", lessonForm.value.videoFile);
    }

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: formData,
    });

    useToastSuccess("Sukses", isEdit ? "Lesson berhasil diperbarui" : "Lesson berhasil ditambahkan");
    await refreshCurriculum();
    activeMode.value = "idle";
    selectedItem.value = null;
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Gagal menyimpan lesson", error.data?.message || "Terjadi kesalahan");
    }
    else {
      useToastError("Gagal menyimpan lesson", "Terjadi kesalahan");
    }
  }
  finally {
    isLoading.value = false;
  }
}

async function handleBack() {
  await navigateTo("/dashboard/admin/produk/course");
}
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumb and Page Header -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div class="space-y-1 min-w-0">
          <h1 class="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2 truncate">
            <UIcon name="i-lucide-book-open" class="text-primary-500 shrink-0" />
            {{ course?.judul || 'Kelola Kurikulum' }}
          </h1>
          <div class="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-user" class="text-[10px]" />
              Publisher: <strong class="text-neutral-700 dark:text-neutral-200 font-medium">{{ course?.namaPublisher || '-' }}</strong>
            </span>
            <span class="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-layers" class="text-[10px]" />
              {{ curriculum?.length || 0 }} Section
            </span>
            <span class="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-video" class="text-[10px]" />
              {{ totalLessons }} Lesson
            </span>
            <span class="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-clock" class="text-[10px]" />
              Total Durasi: <strong class="text-neutral-700 dark:text-neutral-200 font-medium">{{ totalDurationString }}</strong>
            </span>
          </div>
        </div>
        <div class="shrink-0">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            @click="handleBack"
          >
            Kembali
          </UButton>
        </div>
      </div>
    </div>

    <!-- Loading / Skeleton State -->
    <div v-if="courseStatus === 'pending' || curriculumStatus === 'pending'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <UCard :ui="{ body: 'p-6 min-h-[420px]' }">
            <div class="space-y-6">
              <USkeleton class="h-6 w-32" />
              <div class="space-y-4">
                <USkeleton class="h-12 w-full" />
                <USkeleton class="h-32 w-full" />
                <div class="grid grid-cols-2 gap-4">
                  <USkeleton class="h-12 w-full" />
                  <USkeleton class="h-12 w-full" />
                </div>
              </div>
            </div>
          </UCard>
        </div>
        <div class="lg:col-span-1">
          <UCard :ui="{ body: 'p-4' }">
            <div class="space-y-4">
              <USkeleton class="h-6 w-40" />
              <div class="space-y-3">
                <USkeleton class="h-14 w-full" />
                <USkeleton class="h-14 w-full" />
                <USkeleton class="h-14 w-full" />
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Layout Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Workspace (Left Panel) -->
      <div class="lg:col-span-2 space-y-6">
        <UCard
          :ui="{
            body: 'p-6 flex-grow flex flex-col justify-center',
            header: 'px-6 py-4 border-b border-neutral-200 dark:border-neutral-800',
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <UIcon name="i-lucide-sliders" class="text-neutral-500" />
                Panel Detail & Editor
              </h2>
              <UBadge v-if="activeMode !== 'idle'" color="primary" variant="subtle" size="sm">
                {{ activeMode === 'edit-section' ? (selectedSection ? 'Edit Section' : 'Tambah Section') : activeMode === 'create-lesson' ? 'Tambah Lesson' : 'Edit Lesson' }}
              </UBadge>
            </div>
          </template>

          <!-- Idle Placeholder -->
          <div v-if="activeMode === 'idle'" class="text-center py-8 px-4 space-y-6">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50 flex items-center justify-center text-primary-500 shadow-sm">
              <UIcon name="i-lucide-folder-kanban" class="text-2xl" />
            </div>
            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Workspace Kurikulum
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Pilih modul/section atau lesson di panel kanan untuk mulai mengedit detail materi, mengunggah video, atau menambahkan materi baru.
              </p>
            </div>

            <!-- Quick Guideline Info Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-4 text-left">
              <div class="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1">
                <div class="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium text-xs">
                  <UIcon name="i-lucide-folder" class="text-primary-500 text-xs" />
                  <span>Buat Section</span>
                </div>
                <p class="text-[10px] text-neutral-500 leading-normal">
                  Kelompokkan materi ke dalam bab/modul utama pembelajaran.
                </p>
              </div>
              <div class="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1">
                <div class="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium text-xs">
                  <UIcon name="i-lucide-video" class="text-primary-500 text-xs" />
                  <span>Unggah Video</span>
                </div>
                <p class="text-[10px] text-neutral-500 leading-normal">
                  Tambahkan materi video dengan durasi terstruktur ke lesson.
                </p>
              </div>
              <div class="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1">
                <div class="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium text-xs">
                  <UIcon name="i-lucide-list-ordered" class="text-primary-500 text-xs" />
                  <span>Urutan Materi</span>
                </div>
                <p class="text-[10px] text-neutral-500 leading-normal">
                  Gunakan nomor urut untuk menyusun materi secara sistematis.
                </p>
              </div>
            </div>

            <div class="pt-4">
              <UButton
                variant="subtle"
                icon="i-lucide-plus"
                color="primary"
                @click="clickAddSection"
              >
                Buat Section Baru
              </UButton>
            </div>
          </div>

          <!-- Section Editor Form -->
          <SectionForm
            v-else-if="activeMode === 'edit-section'"
            v-model="sectionForm"
            :selected-section="selectedSection"
            :is-loading="isLoading"
            @submit="saveSection"
            @cancel="() => { activeMode = 'idle' }"
            @delete="clickDeleteSection"
          />

          <!-- Lesson Editor Forms (Create / Edit) -->
          <LessonForm
            v-else-if="activeMode === 'create-lesson' || activeMode === 'edit-lesson'"
            v-model="lessonForm"
            :selected-lesson="selectedLesson"
            :is-loading="isLoading"
            :image-url-config="config.public.imageUrl"
            :active-mode="activeMode"
            @submit="saveLesson"
            @cancel="() => { activeMode = 'idle' }"
            @delete="clickDeleteLesson"
          />
        </UCard>
      </div>

      <!-- NavigationTree (Right Panel) -->
      <div class="lg:col-span-1 space-y-4">
        <CurriculumTree
          :curriculum="curriculum ?? null"
          :active-mode="activeMode"
          :selected-section-id="selectedSection?.id ?? null"
          :selected-lesson-id="selectedLesson?.id ?? null"
          @select-section="selectSection"
          @select-lesson="selectLesson"
          @add-section="clickAddSection"
          @add-lesson="clickAddLesson"
        />
      </div>
    </div>

    <!-- Modern Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen" title="Konfirmasi Hapus">
      <template #body>
        <div class="space-y-3">
          <div class="w-10 h-10 rounded-full bg-error-50 dark:bg-error-950/30 flex items-center justify-center text-error-500">
            <UIcon name="i-lucide-alert-triangle" class="text-xl" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-neutral-900 dark:text-white">
              Apakah Anda yakin?
            </h4>
            <p class="text-xs text-neutral-550 dark:text-neutral-400 mt-1">
              {{ deleteTargetType === 'section'
                ? 'Tindakan ini akan menghapus section ini beserta seluruh lesson dan file video di dalamnya secara permanen.'
                : 'Tindakan ini akan menghapus lesson beserta file videonya secara permanen.' }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="ghost"
          :disabled="isLoading"
          @click="() => { isDeleteModalOpen = false }"
        >
          Batal
        </UButton>
        <UButton
          color="error"
          :loading="isLoading"
          @click="confirmDelete"
        >
          Hapus Permanen
        </UButton>
      </template>
    </UModal>
  </div>
</template>

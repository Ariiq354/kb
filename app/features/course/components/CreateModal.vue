<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "../constants";
import { FetchError } from "ofetch";
import { ref } from "vue";
import Editor from "~/components/Custom/Editor.vue";
import UploadImage from "~/components/Custom/UploadImage.vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { presignAndUploadFile } from "~/utils/upload";
import { schema } from "../constants";

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open", {
  required: true,
});

const state = defineModel<Partial<Schema>>("state", {
  required: true,
});

const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  try {
    const isEdit = !!state.value.id;
    const url = `/api/v1/course/${isEdit ? state.value.id : ""}`;

    let fileKey: string | undefined;

    if (state.value.file) {
      fileKey = await presignAndUploadFile("course", state.value.file);
    }

    const { file: _file, foto: _foto, ...body } = event.data;

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: {
        ...body,
        ...(fileKey ? { file: fileKey } : {}),
      },
    });

    useToastSuccess("Sukses", isEdit ? "Data course berhasil diubah" : "Data course berhasil ditambahkan");
    openModel.value = false;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Submit Gagal", error.data?.message || "Terjadi kesalahan pada server");
    }
    else {
      useToastError("Submit Gagal", "Internal Server Error");
    }
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <LazyUModal
    v-model:open="openModel"
    :title="state.id ? 'Edit Course' : 'Tambah Course'"
    class="max-w-4xl"
  >
    <template #body>
      <UForm
        id="form-course"
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <UFormField label="Thumbnail Course" name="file">
            <div class="flex items-center gap-4 mt-2">
              <UploadImage
                v-model:file="state.file"
                v-model:foto="state.foto"
                ratio="16:9"
                :disabled="isLoading"
              />
            </div>
          </UFormField>

          <UFormField label="Judul" name="judul">
            <UInput
              v-model="state.judul"
              placeholder="Masukkan judul course"
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Harga (Rp)" name="harga">
              <UInputNumber
                v-model="state.harga"
                placeholder="0"
                class="w-full"
                :disabled="isLoading"
                :format-options="{
                  style: 'currency',
                  currency: 'IDR',
                  currencyDisplay: 'symbol',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }"
              />
            </UFormField>

            <UFormField label="Nama Publisher" name="namaPublisher">
              <UInput
                v-model="state.namaPublisher"
                placeholder="Nama penerbit/pembuat course"
                class="w-full"
                :disabled="isLoading"
              />
            </UFormField>
          </div>

          <UFormField label="Deskripsi Singkat" name="deskripsi">
            <UTextarea
              v-model="state.deskripsi"
              placeholder="Ringkasan singkat course..."
              class="w-full"
              :rows="3"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField label="Konten Detail Course (Rich Text)" name="konten">
            <Editor
              v-model="state.konten"
              placeholder="Tulis silabus lengkap, ringkasan modul materi, dan target pembelajaran course..."
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField name="status">
            <USwitch
              v-model="state.status"
              label="Status Aktif"
              :disabled="isLoading"
            />
          </UFormField>
        </div>
      </UForm>
    </template>
    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="isLoading"
        @click="() => { openModel = false }"
      >
        Tutup
      </UButton>
      <UButton
        type="submit"
        icon="i-lucide-check"
        :loading="isLoading"
        form="form-course"
      >
        Simpan
      </UButton>
    </template>
  </LazyUModal>
</template>

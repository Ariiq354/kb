<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "../constants";
import { FetchError } from "ofetch";
import { ref } from "vue";
import UploadImage from "~/components/Custom/UploadImage.vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { schema } from "../constants";

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open", {
  required: true,
});

const state = defineModel<Partial<Schema>>("state", {
  required: true,
});

const isLoading = ref(false);
const config = useRuntimeConfig();

function handlePdfChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    state.value.pdfFile = target.files[0];
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  try {
    const isEdit = !!state.value.id;
    const url = `/api/v1/ebook/${isEdit ? state.value.id : ""}`;

    const formData = new FormData();

    // Append regular fields
    for (const [key, value] of Object.entries(event.data)) {
      if (value !== undefined && value !== null && key !== "file" && key !== "foto" && key !== "pdfFile" && key !== "pdfUrl") {
        formData.append(key, value.toString());
      }
    }

    // Append cover image file if it was uploaded
    if (state.value.file) {
      formData.append("file", state.value.file);
    }

    // Append PDF file if it was uploaded
    if (state.value.pdfFile) {
      formData.append("pdfFile", state.value.pdfFile);
    }

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: formData,
    });

    useToastSuccess("Sukses", isEdit ? "Data ebook berhasil diubah" : "Data ebook berhasil ditambahkan");
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
    :title="state.id ? 'Edit Ebook' : 'Tambah Ebook'"
    class="max-w-xl"
  >
    <template #body>
      <UForm
        id="form-ebook"
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <UFormField label="Cover Ebook" name="file">
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
              placeholder="Masukkan judul ebook"
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

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

          <UFormField label="File PDF Ebook" name="pdfFile">
            <div class="flex flex-col gap-2 mt-1">
              <UInput
                type="file"
                accept="application/pdf"
                :disabled="isLoading"
                class="w-full"
                @change="handlePdfChange"
              />
              <span v-if="state.pdfUrl" class="text-xs text-neutral-500">
                File saat ini: <a :href="`${config.public.imageUrl}/${state.pdfUrl}`" target="_blank" class="text-blue-500 hover:underline">{{ state.pdfUrl }}</a>
              </span>
            </div>
          </UFormField>

          <UFormField label="Deskripsi" name="deskripsi">
            <UTextarea
              v-model="state.deskripsi"
              placeholder="Detail deskripsi ebook..."
              class="w-full"
              :rows="4"
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
        form="form-ebook"
      >
        Simpan
      </UButton>
    </template>
  </LazyUModal>
</template>

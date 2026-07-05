<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "./constants";
import { FetchError } from "ofetch";
import { ref } from "vue";
import { initFormData, schema } from "./constants";

const { data, refresh } = await useFetch("/api/v1/users/me");

const state = ref(initFormData(data?.value));
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;
  const formData = new FormData();

  for (const [key, value] of Object.entries(
    event.data as Record<string, any>,
  )) {
    if (value) {
      formData.append(key, value);
    }
  }

  try {
    await $fetch("/api/v1/users/me", {
      body: formData,
      method: "PATCH",
    });

    useToastSuccess("Submit Berhasil", "Data berhasil diperbarui");
    await refresh();
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Submit Gagal", error.data.message);
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
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div class="md:col-span-4 space-y-6">
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="relative h-24 overflow-hidden bg-linear-to-r from-primary-500 to-primary-600">
          <svg class="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0C100 80 300 0 400 100L400 0H0Z" fill="white" />
            <path d="M0 100C150 0 250 50 400 0V100H0Z" fill="white" opacity="0.5" />
          </svg>
        </div>

        <div class="px-6 pb-6 flex flex-col items-center text-center -mt-12">
          <div class="relative mb-3 bg-white p-1 rounded-xl shadow-sm ring-1 ring-gray-100">
            <UploadImage
              v-model:file="state.file"
              v-model:foto="state.foto"
              :disabled="isLoading"
            />
          </div>

          <h2 class="text-xl font-bold text-gray-900 mt-2">
            {{ data?.name || '-' }}
          </h2>
          <p class="text-sm font-medium text-primary-600 mt-1">
            {{ data?.namaJabatan || '-' }}
          </p>

          <div v-if="data?.namaPangkat" class="mt-3 flex items-center gap-1.5 bg-gray-50 border border-primary-100 px-3 py-1 rounded-full text-xs text-primary-700">
            <UIcon name="i-lucide-award" class="size-3.5 text-green-500" />
            <span class="font-medium">{{ data?.namaPangkat }}</span>
          </div>

          <div class="w-full border-t border-gray-100 mt-6 pt-5 flex flex-col gap-3.5 text-sm text-left">
            <div class="flex items-center gap-3 text-gray-600">
              <UIcon name="i-lucide-id-card" class="size-4.5 text-gray-400 shrink-0" />
              <span class="truncate font-medium">{{ data?.nip9 || '-' }}</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600">
              <UIcon name="i-lucide-building-2" class="size-4.5 text-gray-400 shrink-0" />
              <span class="line-clamp-2 leading-snug">{{ data?.namaKantor || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="md:col-span-8">
      <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <UForm
          id="form-profile"
          class="space-y-8"
          :state="state"
          :schema="schema"
          @submit="onSubmit"
        >
          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-user-round" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900">
                Data Pribadi
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <UFormField label="Nama Lengkap">
                <UInput
                  :model-value="data?.name"
                  disabled
                />
              </UFormField>
              <UFormField label="Jenis Kelamin" name="gender">
                <USelect
                  v-model="state.gender"
                  :items="['Laki-laki', 'Perempuan']"
                  :disabled="isLoading "
                />
              </UFormField>
              <UFormField label="Nomor HP" name="noHp">
                <UInput
                  v-model="state.noHp"
                  :disabled="isLoading "
                />
              </UFormField>
              <UFormField label="Pendidikan Formal" name="pendidikanFormal">
                <UInput
                  v-model="state.pendidikanFormal"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-briefcase-business" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900">
                Data Kepegawaian
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <UFormField label="NIP 9" name="nip9">
                <UInput
                  :model-value="data?.nip9 ?? ''"
                  disabled
                />
              </UFormField>
              <UFormField label="NIP 18" name="nip18">
                <UInput
                  v-model="state.nip18"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Nama Kantor" name="namaKantor">
                <UInput
                  v-model="state.namaKantor"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Provinsi Kantor" name="provinsiKantor">
                <SelectProvinsi
                  v-model="state.provinsiKantor"
                  :disabled="isLoading"
                />
              </UFormField>

              <UFormField label="Unit Eselon 4" name="namaUnitEs4" class="md:col-span-2">
                <UInput
                  v-model="state.namaUnitEs4"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Jabatan" name="idJabatan">
                <SelectJabatan
                  v-model="state.idJabatan"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Pangkat" name="namaPangkat">
                <UInput
                  v-model="state.namaPangkat"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-map-pin" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900">
                Alamat Homebase
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <UFormField label="Alamat Tempat Tinggal" name="alamat" class="md:col-span-2">
                <UTextarea
                  v-model="state.alamat"
                  :rows="4"
                  :disabled="isLoading"
                  autoresize
                />
              </UFormField>
              <UFormField label="Provinsi" name="provinsi">
                <SelectProvinsi
                  v-model="state.provinsi"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Kabupaten/Kota" name="kota">
                <SelectKota
                  v-model="state.kota"
                  :province-id="state.provinsi"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div class="flex justify-end gap-4 border-t border-gray-100 pt-6 mt-8">
            <UButton type="submit" :loading="isLoading">
              Simpan
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

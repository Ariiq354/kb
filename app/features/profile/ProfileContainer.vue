<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "./constants";
import { FetchError } from "ofetch";
import { ref } from "vue";
import UploadImage from "~/components/Custom/UploadImage.vue";
import SelectDesa from "~/components/Options/SelectDesa.vue";
import SelectKecamatan from "~/components/Options/SelectKecamatan.vue";
import SelectKota from "~/components/Options/SelectKota.vue";
import SelectProvinsi from "~/components/Options/SelectProvinsi.vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { initFormData, schema } from "./constants";

const { data, refresh } = await useFetch("/api/v1/users/me");

const state = ref(initFormData(data?.value));
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!state.value.foto && !state.value.file) {
    useToastError("Submit Gagal", "Foto profil wajib diunggah");
    return;
  }

  isLoading.value = true;
  const formData = new FormData();

  for (const [key, value] of Object.entries(
    event.data as Record<string, any>,
  )) {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value.toString());
    }
  }

  formData.append("file", state.value.file!);

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
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <div class="relative h-24 overflow-hidden bg-linear-to-r from-primary-500 to-primary-600">
          <svg class="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0C100 80 300 0 400 100L400 0H0Z" fill="white" />
            <path d="M0 100C150 0 250 50 400 0V100H0Z" fill="white" opacity="0.5" />
          </svg>
        </div>

        <div class="px-6 pb-6 flex flex-col items-center text-center -mt-12">
          <div class="relative mb-3 bg-white p-1 rounded-xl shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
            <UploadImage
              v-model:file="state.file"
              v-model:foto="state.foto"
              :disabled="isLoading"
            />
          </div>

          <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-2">
            {{ data?.name || '-' }}
          </h2>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1">
            {{ data?.pekerjaan || 'Belum ada pekerjaan' }}
          </p>

          <div v-if="data?.kodeUser" class="mt-3 flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-primary-100 dark:border-primary-900 px-3 py-1 rounded-full text-xs text-primary-700 dark:text-primary-300">
            <UIcon name="i-lucide-award" class="size-3.5 text-green-500" />
            <span class="font-medium">{{ data?.kodeUser }}</span>
          </div>

          <div class="w-full border-t border-gray-100 dark:border-gray-800 mt-6 pt-5 flex flex-col gap-3.5 text-sm text-left">
            <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <UIcon name="i-lucide-mail" class="size-4.5 text-gray-400 shrink-0" />
              <span class="truncate font-medium">{{ data?.email || '-' }}</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <UIcon name="i-lucide-phone" class="size-4.5 text-gray-400 shrink-0" />
              <span class="truncate font-medium">{{ data?.noTelepon || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="md:col-span-8">
      <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm dark:bg-gray-900 dark:border-gray-800">
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
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Data Pribadi
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Tanggal Lahir" name="tanggalLahir">
                <UInput
                  v-model="state.tanggalLahir"
                  type="date"
                  :disabled="isLoading"
                  placeholder="Pilih Tanggal Lahir"
                />
              </UFormField>
              <UFormField label="Jenis Kelamin" name="gender">
                <USelect
                  v-model="state.gender"
                  :items="['Laki-laki', 'Perempuan']"
                  :disabled="isLoading"
                  placeholder="Pilih Jenis Kelamin"
                />
              </UFormField>
              <UFormField label="Status Kawin" name="statusKawin">
                <UInput
                  v-model="state.statusKawin"
                  placeholder="Contoh: Belum Kawin / Kawin / Cerai"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Agama" name="agama">
                <UInput
                  v-model="state.agama"
                  placeholder="Contoh: Islam, Kristen, dll."
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Status Perokok" name="perokok" class="md:col-span-2">
                <UCheckbox
                  v-model="state.perokok"
                  label="Saya seorang perokok"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-map-pin" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Lokasi & Kontak
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
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
              <UFormField label="Kecamatan" name="kecamatan">
                <SelectKecamatan
                  v-model="state.kecamatan"
                  :regency-id="state.kota"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Kelurahan" name="kelurahan">
                <SelectDesa
                  v-model="state.kelurahan"
                  :district-id="state.kecamatan"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Instagram" name="instagram" class="md:col-span-2">
                <UInput
                  v-model="state.instagram"
                  placeholder="@username"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-users" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Keluarga & Fisik
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Nama Ayah" name="namaAyah">
                <UInput
                  v-model="state.namaAyah"
                  placeholder="Masukkan Nama Ayah"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Suku" name="suku">
                <UInput
                  v-model="state.suku"
                  placeholder="Contoh: Jawa, Sunda, dll."
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Anak Ke" name="anakKe">
                <UInput
                  v-model="state.anakKe"
                  type="number"
                  placeholder="Contoh: 1"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Dari Bersaudara" name="dariBersaudara">
                <UInput
                  v-model="state.dariBersaudara"
                  type="number"
                  placeholder="Contoh: 3"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Tinggi Badan (cm)" name="tinggi">
                <UInput
                  v-model="state.tinggi"
                  type="number"
                  placeholder="Contoh: 170"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Berat Badan (kg)" name="berat">
                <UInput
                  v-model="state.berat"
                  type="number"
                  placeholder="Contoh: 65"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-briefcase" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Pendidikan & Pekerjaan
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Pendidikan Terakhir" name="pendidikan">
                <UInput
                  v-model="state.pendidikan"
                  placeholder="Contoh: S1, SMA"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Jurusan" name="jurusan">
                <UInput
                  v-model="state.jurusan"
                  placeholder="Contoh: Teknik Informatika"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Pekerjaan" name="pekerjaan">
                <UInput
                  v-model="state.pekerjaan"
                  placeholder="Contoh: Software Engineer"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Estimasi Gaji" name="gaji">
                <UInput
                  v-model="state.gaji"
                  type="number"
                  placeholder="Contoh: 5000000"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-heart" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Preferensi Tambahan
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Hobi" name="hobi">
                <UInput
                  v-model="state.hobi"
                  placeholder="Contoh: Membaca, Olahraga"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Kriteria Pasangan" name="kriteria">
                <UInput
                  v-model="state.kriteria"
                  placeholder="Masukkan Kriteria Pasangan"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Deskripsi Diri" name="deskripsi" class="md:col-span-2">
                <UTextarea
                  v-model="state.deskripsi"
                  :rows="4"
                  placeholder="Ceritakan tentang diri Anda"
                  :disabled="isLoading"
                  autoresize
                />
              </UFormField>
            </div>
          </div>

          <div class="flex justify-end gap-4 border-t border-gray-100 dark:border-gray-800 pt-6 mt-8">
            <UButton type="submit" :loading="isLoading">
              Simpan Profil
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>
